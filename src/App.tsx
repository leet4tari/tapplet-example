import { useEffect, useState } from "react";
import "./App.css";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { TariProvider } from "./tari-provider";

let __id = 0;

type Request = {
  id: number;
  methodName: keyof TariProvider;
  args: unknown[];
};

async function providerWrapper(req: Omit<Request, "id">) {
  return new Promise(function (resolve, reject) {
    const id = ++__id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event_ref = function (resp: any) {
      if (resp && resp.data && resp.data.id && resp.data.id == id) {
        window.removeEventListener("message", event_ref);
        resolve(resp.data);
      }
    };
    window.addEventListener("message", event_ref, false);

    window.parent.postMessage({ ...req, id }, "http://localhost:5173/");
  });
}

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
    providerWrapper({ methodName: "getAccount", args: [] });
  }

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{ mty: 4, padding: 3, borderRadius: 4 }}
    >
      <Stack direction="column" spacing={2}>
        <Button
          variant="contained"
          sx={{ width: "50%" }}
          onClick={async () => {
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
