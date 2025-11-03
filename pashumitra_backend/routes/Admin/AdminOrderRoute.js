// routes/Admin/adminOrderRoutes.js
import express from "express";
import mongoose from "mongoose";
import CommunityMedicineOrder from "../../models/MedicalStore/CommunityMedicineOrder.js";
import RegularMedicineOrder from "../../models/MedicalStore/MedicineOrder.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const router = express.Router();

// Get all orders (both community and regular) with advanced filtering
router.get("/orders", async (req, res) => {
  try {
    const { 
      type, // 'community', 'regular', or 'all'
      status, 
      storeId, 
      farmerId, 
      startDate, 
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;

    let communityOrders = [];
    let regularOrders = [];
    let totalCommunity = 0;
    let totalRegular = 0;

    // Base filters
    const baseFilter = {};
    if (status) baseFilter.status = status;
    if (storeId) baseFilter.storeId = storeId;
    if (farmerId) baseFilter.farmerId = farmerId;

    // Date filter
    if (startDate || endDate) {
      baseFilter.createdAt = {};
      if (startDate) baseFilter.createdAt.$gte = new Date(startDate);
      if (endDate) baseFilter.createdAt.$lte = new Date(endDate);
    }

    // Fetch community orders
    if (type === 'all' || type === 'community' || !type) {
      const communityFilter = { ...baseFilter };
      
      totalCommunity = await CommunityMedicineOrder.countDocuments(communityFilter);
      
      communityOrders = await CommunityMedicineOrder.find(communityFilter)
        .populate("medicineId", "medicineName manufacturer composition expiryDate")
        .populate("storeId", "email")
        .populate("farmerId", "email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(type === 'community' ? limit : Math.floor(limit / 2))
        .lean();
    }

    // Fetch regular orders
    if (type === 'all' || type === 'regular' || !type) {
      const regularFilter = { ...baseFilter };
      
      totalRegular = await RegularMedicineOrder.countDocuments(regularFilter);
      
      regularOrders = await RegularMedicineOrder.find(regularFilter)
        .populate("medicineId", "name price manufacturer composition")
        .populate("storeId", "email")
        .populate("farmerId", "email phone")
        .populate("transferredToStore.storeId", "email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(type === 'regular' ? limit : Math.floor(limit / 2))
        .lean();
    }

    // Combine and format orders
    const allOrders = [
      ...communityOrders.map(order => ({
        ...order,
        orderType: 'community',
        id: order._id,
        medicineDetails: {
          name: order.medicineId?.medicineName || 'N/A',
          manufacturer: order.medicineId?.manufacturer || 'N/A',
          price: 'Free',
          type: 'Community'
        }
      })),
      ...regularOrders.map(order => ({
        ...order,
        orderType: 'regular',
        id: order._id,
        medicineDetails: {
          name: order.medicineId?.name || 'N/A',
          manufacturer: order.medicineId?.manufacturer || 'N/A',
          price: `₹${order.totalPrice || 0}`,
          type: 'Regular'
        }
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get store and farmer details for better information
    const StoreUser = mongoose.model("Store_User");
    const FarmerModel = await import("../../models/Farmer/FarmerModel.js").then(m => m.default).catch(() => null);

    const ordersWithDetails = await Promise.all(
      allOrders.map(async (order) => {
        try {
          const orderWithDetails = { ...order };

          // Get store details
          if (order.storeId) {
            const storeProfile = await StoreUser.findOne({ userId: order.storeId._id || order.storeId });
            if (storeProfile) {
              orderWithDetails.storeDetails = {
                name: storeProfile.storeName,
                email: order.storeId.email,
                phone: storeProfile.phone,
                address: storeProfile.address
              };
            }
          }

          // Get farmer details
          if (FarmerModel && order.farmerId) {
            const farmer = await FarmerModel.findOne({ userId: order.farmerId._id || order.farmerId });
            if (farmer) {
              orderWithDetails.farmerDetails = {
                name: farmer.fullName,
                email: order.farmerId.email,
                phone: farmer.userId?.phone || 'N/A',
                address: `${farmer.address}${farmer.village ? ', ' + farmer.village : ''}, ${farmer.city}, ${farmer.state} - ${farmer.pincode}`
              };
            }
          }

          return orderWithDetails;
        } catch (error) {
          console.error(`Error fetching details for order ${order._id}:`, error);
          return order;
        }
      })
    );

    const totalOrders = totalCommunity + totalRegular;
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      data: {
        orders: ordersWithDetails,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          totalCommunity,
          totalRegular,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("❌ Error fetching admin orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
});

// Get order statistics for admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Community medicine stats
    const communityStats = await CommunityMedicineOrder.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantityRequested" }
        }
      }
    ]);

    // Regular medicine stats
    const regularStats = await RegularMedicineOrder.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantityRequested" },
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    // Total counts
    const totalCommunityOrders = await CommunityMedicineOrder.countDocuments(dateFilter);
    const totalRegularOrders = await RegularMedicineOrder.countDocuments(dateFilter);

    // Recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentCommunity = await CommunityMedicineOrder.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    const recentRegular = await RegularMedicineOrder.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    const stats = {
      community: {
        total: totalCommunityOrders,
        byStatus: communityStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, quantity: stat.totalQuantity };
          return acc;
        }, {}),
        recent: recentCommunity
      },
      regular: {
        total: totalRegularOrders,
        byStatus: regularStats.reduce((acc, stat) => {
          acc[stat._id] = { 
            count: stat.count, 
            quantity: stat.totalQuantity,
            revenue: stat.totalRevenue || 0
          };
          return acc;
        }, {}),
        recent: recentRegular
      },
      overall: {
        totalOrders: totalCommunityOrders + totalRegularOrders,
        totalRevenue: regularStats.reduce((sum, stat) => sum + (stat.totalRevenue || 0), 0),
        recentOrders: recentCommunity + recentRegular
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message
    });
  }
});

// Export orders to PDF
router.get("/export/pdf", async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;

    const filter = {};
    if (type && type !== 'all') {
      // Will handle in code
    }
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let communityOrders = [];
    let regularOrders = [];

    if (!type || type === 'all' || type === 'community') {
      communityOrders = await CommunityMedicineOrder.find(filter)
        .populate("medicineId", "medicineName manufacturer")
        .populate("storeId", "email")
        .populate("farmerId", "email")
        .sort({ createdAt: -1 })
        .lean();
    }

    if (!type || type === 'all' || type === 'regular') {
      regularOrders = await RegularMedicineOrder.find(filter)
        .populate("medicineId", "name price manufacturer")
        .populate("storeId", "email")
        .populate("farmerId", "email")
        .sort({ createdAt: -1 })
        .lean();
    }

    const doc = new PDFDocument({ margin: 50 });
    const filename = `medicine-orders-${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text('Medicine Orders Report', 50, 50);
    doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, 50, 80);
    
    // Summary
    doc.fontSize(12).text(`Total Community Orders: ${communityOrders.length}`, 50, 110);
    doc.text(`Total Regular Orders: ${regularOrders.length}`, 50, 125);
    doc.text(`Total Orders: ${communityOrders.length + regularOrders.length}`, 50, 140);

    let yPosition = 170;

    // Community Orders
    if (communityOrders.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Community Medicine Orders:', 50, yPosition);
      yPosition += 30;

      communityOrders.forEach((order, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(10).font('Helvetica-Bold').text(`Order ${index + 1}:`, 50, yPosition);
        yPosition += 15;
        
        doc.font('Helvetica').text(`Medicine: ${order.medicineId?.medicineName || 'N/A'}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Farmer: ${order.farmerName} (${order.farmerId?.email || 'N/A'})`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Store: ${order.storeId?.email || 'N/A'}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Quantity: ${order.quantityRequested}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Status: ${order.status}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 70, yPosition);
        yPosition += 20;
      });
    }

    // Regular Orders
    if (regularOrders.length > 0) {
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      doc.fontSize(14).font('Helvetica-Bold').text('Regular Medicine Orders:', 50, yPosition);
      yPosition += 30;

      regularOrders.forEach((order, index) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(10).font('Helvetica-Bold').text(`Order ${index + 1}:`, 50, yPosition);
        yPosition += 15;
        
        doc.font('Helvetica').text(`Medicine: ${order.medicineId?.name || 'N/A'}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Farmer: ${order.farmerName} (${order.farmerId?.email || 'N/A'})`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Store: ${order.storeId?.email || 'N/A'}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Quantity: ${order.quantityRequested}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Total Price: ₹${order.totalPrice}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Status: ${order.status}`, 70, yPosition);
        yPosition += 12;
        
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 70, yPosition);
        yPosition += 20;
      });
    }

    doc.end();

  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({
      success: false,
      message: "Error generating PDF",
      error: error.message
    });
  }
});


// Export orders to Excel - FIXED VERSION
router.get("/export/excel", async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    let communityOrders = [];
    let regularOrders = [];

    if (!type || type === 'all' || type === 'community') {
      communityOrders = await CommunityMedicineOrder.find(filter)
        .populate("medicineId", "medicineName manufacturer")
        .populate("storeId", "email")
        .populate("farmerId", "email")
        .sort({ createdAt: -1 })
        .lean();
    }

    if (!type || type === 'all' || type === 'regular') {
      regularOrders = await RegularMedicineOrder.find(filter)
        .populate("medicineId", "name price manufacturer")
        .populate("storeId", "email")
        .populate("farmerId", "email")
        .sort({ createdAt: -1 })
        .lean();
    }

    const workbook = new ExcelJS.Workbook();
    
    // Add metadata
    workbook.creator = 'Admin System';
    workbook.lastModifiedBy = 'Admin System';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Community Orders Sheet
    if (communityOrders.length > 0) {
      const communitySheet = workbook.addWorksheet('Community Orders');
      
      // Set column widths
      communitySheet.columns = [
        { header: 'Order ID', key: 'id', width: 25 },
        { header: 'Medicine Name', key: 'medicineName', width: 25 },
        { header: 'Manufacturer', key: 'manufacturer', width: 20 },
        { header: 'Farmer Name', key: 'farmerName', width: 20 },
        { header: 'Farmer Email', key: 'farmerEmail', width: 25 },
        { header: 'Store Email', key: 'storeEmail', width: 25 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Order Date', key: 'orderDate', width: 15 },
        { header: 'Price', key: 'price', width: 15 }
      ];

      // Add header style
      communitySheet.getRow(1).font = { bold: true };
      communitySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };

      // Add data rows
      communityOrders.forEach(order => {
        communitySheet.addRow({
          id: order._id.toString(),
          medicineName: order.medicineId?.medicineName || 'N/A',
          manufacturer: order.medicineId?.manufacturer || 'N/A',
          farmerName: order.farmerName,
          farmerEmail: order.farmerId?.email || 'N/A',
          storeEmail: order.storeId?.email || 'N/A',
          quantity: order.quantityRequested,
          status: order.status,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          price: 'Free'
        });
      });

      // Add summary
      const summaryRow = communityOrders.length + 3;
      communitySheet.addRow([]);
      communitySheet.getCell(`A${summaryRow}`).value = 'Summary';
      communitySheet.getCell(`A${summaryRow}`).font = { bold: true };
      
      communitySheet.getCell(`A${summaryRow + 1}`).value = 'Total Orders';
      communitySheet.getCell(`B${summaryRow + 1}`).value = communityOrders.length;
      
      communitySheet.getCell(`A${summaryRow + 2}`).value = 'Total Quantity';
      communitySheet.getCell(`B${summaryRow + 2}`).value = communityOrders.reduce((sum, order) => sum + order.quantityRequested, 0);
    }

    // Regular Orders Sheet
    if (regularOrders.length > 0) {
      const regularSheet = workbook.addWorksheet('Regular Orders');
      
      regularSheet.columns = [
        { header: 'Order ID', key: 'id', width: 25 },
        { header: 'Medicine Name', key: 'medicineName', width: 25 },
        { header: 'Manufacturer', key: 'manufacturer', width: 20 },
        { header: 'Farmer Name', key: 'farmerName', width: 20 },
        { header: 'Farmer Email', key: 'farmerEmail', width: 25 },
        { header: 'Store Email', key: 'storeEmail', width: 25 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Total Price', key: 'totalPrice', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Order Date', key: 'orderDate', width: 15 },
        { header: 'Animal Type', key: 'animalType', width: 15 }
      ];

      // Add header style
      regularSheet.getRow(1).font = { bold: true };
      regularSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };

      // Add data rows
      regularOrders.forEach(order => {
        regularSheet.addRow({
          id: order._id.toString(),
          medicineName: order.medicineId?.name || 'N/A',
          manufacturer: order.medicineId?.manufacturer || 'N/A',
          farmerName: order.farmerName,
          farmerEmail: order.farmerId?.email || 'N/A',
          storeEmail: order.storeId?.email || 'N/A',
          quantity: order.quantityRequested,
          totalPrice: order.totalPrice,
          status: order.status,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          animalType: order.animalType || 'N/A'
        });
      });

      // Add summary
      const summaryRow = regularOrders.length + 3;
      regularSheet.addRow([]);
      regularSheet.getCell(`A${summaryRow}`).value = 'Summary';
      regularSheet.getCell(`A${summaryRow}`).font = { bold: true };
      
      regularSheet.getCell(`A${summaryRow + 1}`).value = 'Total Orders';
      regularSheet.getCell(`B${summaryRow + 1}`).value = regularOrders.length;
      
      regularSheet.getCell(`A${summaryRow + 2}`).value = 'Total Quantity';
      regularSheet.getCell(`B${summaryRow + 2}`).value = regularOrders.reduce((sum, order) => sum + order.quantityRequested, 0);
      
      regularSheet.getCell(`A${summaryRow + 3}`).value = 'Total Revenue';
      regularSheet.getCell(`B${summaryRow + 3}`).value = regularOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    }

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    // Style summary header
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    summarySheet.addRow({ metric: 'Total Community Orders', value: communityOrders.length });
    summarySheet.addRow({ metric: 'Total Regular Orders', value: regularOrders.length });
    summarySheet.addRow({ metric: 'Total Orders', value: communityOrders.length + regularOrders.length });
    summarySheet.addRow({ metric: 'Total Revenue (Regular)', value: regularOrders.reduce((sum, order) => sum + order.totalPrice, 0) });
    summarySheet.addRow({ metric: 'Total Quantity Distributed', value: communityOrders.reduce((sum, order) => sum + order.quantityRequested, 0) + regularOrders.reduce((sum, order) => sum + order.quantityRequested, 0) });
    summarySheet.addRow({ metric: 'Report Generated', value: new Date().toLocaleString() });

    // Set response headers for Excel file
    const filename = `medicine-orders-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Write to buffer and send
    const buffer = await workbook.xlsx.writeBuffer();
    res.send(buffer);

  } catch (error) {
    console.error("❌ Error generating Excel:", error);
    res.status(500).json({
      success: false,
      message: "Error generating Excel file",
      error: error.message
    });
  }
});

// Get single order details
router.get("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { type } = req.query; // 'community' or 'regular'

    let order;

    if (type === 'community') {
      order = await CommunityMedicineOrder.findById(orderId)
        .populate("medicineId")
        .populate("storeId", "email")
        .populate("farmerId", "email phone")
        .lean();
      
      if (order) {
        order.orderType = 'community';
      }
    } else if (type === 'regular') {
      order = await RegularMedicineOrder.findById(orderId)
        .populate("medicineId")
        .populate("storeId", "email")
        .populate("farmerId", "email phone")
        .populate("transferredToStore.storeId", "email")
        .lean();
      
      if (order) {
        order.orderType = 'regular';
      }
    } else {
      // Try both
      order = await CommunityMedicineOrder.findById(orderId)
        .populate("medicineId")
        .populate("storeId", "email")
        .populate("farmerId", "email phone")
        .lean();
      
      if (order) {
        order.orderType = 'community';
      } else {
        order = await RegularMedicineOrder.findById(orderId)
          .populate("medicineId")
          .populate("storeId", "email")
          .populate("farmerId", "email phone")
          .lean();
        
        if (order) {
          order.orderType = 'regular';
        }
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Get additional store and farmer details
    const StoreUser = mongoose.model("Store_User");
    const FarmerModel = await import("../../models/Farmer/FarmerModel.js").then(m => m.default).catch(() => null);

    if (order.storeId) {
      const storeProfile = await StoreUser.findOne({ userId: order.storeId._id || order.storeId });
      if (storeProfile) {
        order.storeDetails = {
          name: storeProfile.storeName,
          email: order.storeId.email,
          phone: storeProfile.phone,
          address: storeProfile.address,
          licenseNumber: storeProfile.licenseNumber
        };
      }
    }

    if (FarmerModel && order.farmerId) {
      const farmer = await FarmerModel.findOne({ userId: order.farmerId._id || order.farmerId });
      if (farmer) {
        order.farmerDetails = {
          name: farmer.fullName,
          email: order.farmerId.email,
          phone: farmer.userId?.phone || 'N/A',
          address: farmer.address,
          village: farmer.village,
          city: farmer.city,
          state: farmer.state,
          pincode: farmer.pincode,
          completeAddress: `${farmer.address}${farmer.village ? ', ' + farmer.village : ''}, ${farmer.city}, ${farmer.state} - ${farmer.pincode}`
        };
      }
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("❌ Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message
    });
  }
});

export default router;