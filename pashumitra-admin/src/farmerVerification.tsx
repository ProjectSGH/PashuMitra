// FarmerVerificationShow.tsx
import {
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useRecordContext,
    useNotify,
    useRedirect,
    useDataProvider,
} from "react-admin";
import { Button, Stack } from "@mui/material";

const FarmerVerificationActions = () => {
    const record = useRecordContext<any>();
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    
    if (!record) return null;

    const handleVerify = async (action: "approve" | "reject") => {
        try {
            await dataProvider.update('farmer/varify', {
                id: record.farmerId, // Use farmerId for farmer verification
                data: { action },
            });
            
            notify(`Farmer ${action}d successfully`, { type: "success" });
            redirect("list", "farmer/varify");
        } catch (error) {
            console.error("Verification error:", error);
            notify("Error updating verification", { type: "error" });
        }
    };

    return (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button onClick={() => handleVerify("approve")} variant="contained" color="success">
                Approve
            </Button>
            <Button onClick={() => handleVerify("reject")} variant="outlined" color="error">
                Reject
            </Button>
        </Stack>
    );
};

const FarmerVerificationShow = () => {
    const record = useRecordContext<any>();

    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="farmerProfile.fullName" label="Farmer Name" />
                <TextField source="farmerProfile.village" label="Village" />
                <TextField source="farmerProfile.city" label="City" />
                <TextField source="farmerProfile.state" label="State" />

                {record?.verificationDocument?.url && (
                    <Button 
                        variant="outlined" 
                        href={record.verificationDocument.url} 
                        target="_blank"
                        sx={{ mb: 2 }}
                    >
                        View Uploaded Document
                    </Button>
                )}

                <TextField source="verificationStatus" label="Status" />
                <BooleanField source="isVerified" label="Verified" />
                <FarmerVerificationActions />
            </SimpleShowLayout>
        </Show>
    );
};

export default FarmerVerificationShow;