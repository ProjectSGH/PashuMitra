import { Admin, Resource, ListGuesser } from "react-admin";
import { Layout } from "./Layout";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";
import AllUsersPage from "./allUserList";
import NotificationPage from "./sendNotification";

export const App = () => (
    <Admin
        layout={Layout}
        authProvider={authProvider}
        dataProvider={dataProvider}
    >
        <Resource name="users" list={AllUsersPage} />
        <Resource name="notifications" list={NotificationPage} />
    </Admin>
);
