import { useEffect, useState } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import {
  TariPermissions,
  TariUniverseProvider,
  TariUniverseProviderParameters,
  permissions,
} from "@tariproject/tarijs";

const TUpermissions = new TariPermissions();
TUpermissions.addPermission(new permissions.TariPermissionKeyList());
TUpermissions.addPermission(new permissions.TariPermissionAccountInfo());
TUpermissions.addPermission(new permissions.TariPermissionTransactionSend());
TUpermissions.addPermission(new permissions.TariPermissionSubstatesRead());
const optionalPermissions = new TariPermissions();
const params: TariUniverseProviderParameters = {
  permissions: TUpermissions,
  optionalPermissions,
};

const provider = new TariUniverseProvider(params);

function App() {
  const [accountData, setAccountData] = useState({});
  useEffect(() => {
    window.addEventListener(
      "message",
      (event) => {
        console.log(event);
        setAccountData(event.data);
      },
      false
    );
  }, []);
  return (
    <>
      <AccountTest accountData={accountData} />
    </>
  );
}

function AccountTest({ accountData }: { accountData: unknown }) {
  async function getAccountClick() {
    await provider.getAccount();
  }

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{ padding: 3, borderRadius: 4 }}
    >
      <Stack direction="column" spacing={2}>
        <Button
          variant="contained"
          sx={{ width: "50%" }}
          onClick={async (event) => {
            event.preventDefault();
            await getAccountClick();
          }}
        >
          Get Account Data
        </Button>
        <Typography>Result: </Typography>
        <PrettyJson value={{ accountData }}></PrettyJson>
      </Stack>
    </Paper>
  );
}

function PrettyJson({ value }: Record<string, unknown>) {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export default App;
