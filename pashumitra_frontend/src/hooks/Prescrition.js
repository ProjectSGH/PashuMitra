// services/prescriptionService.js
export class PrescriptionService {
  
  // Download prescription from backend
  static async downloadPrescription(consultationId) {
    try {
      console.log("Downloading prescription for consultation ID:", consultationId);
      
      if (!consultationId) {
        throw new Error("Consultation ID is required");
      }

      const response = await fetch(
        `http://localhost:5000/api/consultations/${consultationId}/prescription`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", response.status, errorText);
        throw new Error(`Failed to generate prescription: ${response.status} - ${errorText}`);
      }

      // Convert response to blob and download
      const blob = await response.blob();
      
      // Check if blob is valid
      if (blob.size === 0) {
        throw new Error('Empty PDF generated');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'prescription.pdf';
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log("Prescription downloaded successfully");
      return true;
    } catch (error) {
      console.error('Error downloading prescription:', error);
      throw new Error('Failed to download prescription: ' + error.message);
    }
  }
}