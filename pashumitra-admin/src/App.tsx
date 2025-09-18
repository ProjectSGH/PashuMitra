import { Admin, Resource, ListGuesser } from "react-admin";
import { Layout } from "./Layout";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import AllUsersPage from "./allUserList";
import NotificationPage from "./sendNotification";
import DoctorVerificationShow from "./doctorVerification";
import FarmerVerificationShow from "./farmerVerification";

export const App = () => (
    <Admin
        layout={Layout}
        authProvider={authProvider}
        dataProvider={dataProvider}
    >
        <Resource name="users" list={AllUsersPage} />
        <Resource name="notifications" list={NotificationPage} />
        <Resource
            name="doctor/varify"  // must match the backend mounting
            show={DoctorVerificationShow}
            list={ListGuesser}
        />
        <Resource
            name="farmer/varify"
            show={FarmerVerificationShow}
            list={ListGuesser}
        />
    </Admin>
);
