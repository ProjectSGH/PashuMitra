import {
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useRecordContext,
    useNotify,
    useRedirect,
    useDataProvider, // Add this import
} from "react-admin";
import { Button, Stack } from "@mui/material";

const DoctorVerificationActions = () => {
    const record = useRecordContext<any>();
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider(); // Use the hook
    
    if (!record) return null;

    const handleVerify = async (action: "approve" | "reject") => {
        try {
            // Use react-admin's dataProvider instead of direct axios call
            await dataProvider.update('doctor/varify', {
                id: record.id, // Use the verification document ID
                data: { action },
            });
            
            notify(`Doctor ${action}d successfully`, { type: "success" });
            redirect("list", "doctor/varify");
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

const DoctorVerificationShow = () => {
    const record = useRecordContext<any>();

    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="doctorProfile.name" label="Doctor Name" />
                <TextField source="doctorProfile.specialization" label="Specialization" />
                <TextField source="licenseNumber" label="License Number" />

                {record?.verificationDocument?.url && (
                    <Button variant="outlined" href={record.verificationDocument.url} target="_blank">
                        View Uploaded Document
                    </Button>
                )}

                <TextField source="verificationStatus" label="Status" />
                <BooleanField source="isVerified" label="Verified" />
                <DoctorVerificationActions />
            </SimpleShowLayout>
        </Show>
    );
};

export default DoctorVerificationShow;