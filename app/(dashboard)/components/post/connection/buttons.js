import { Box, Tooltip, Button } from "@mui/joy";
import { Check, X } from "lucide-react";

export default function ConnectionButtons({
  post,
  handleConnect,
  localStatus,
  acceptConnection,
  rejectConnection,
  requestedBy,
}) {
  return (
    <>
      {post.owner !== requestedBy && (
        <>
          {localStatus === "not_connected" && (
            <Button onClick={handleConnect}>Connect</Button>
          )}

          {localStatus === "pending" && <Button disabled>Pending...</Button>}

          {localStatus === "incoming_request" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Accept Request">
                <Button
                  onClick={() => acceptConnection(post.owner)}
                  startDecorator={<Check />}
                />
              </Tooltip>

              <Tooltip title="Reject Request">
                <Button
                  onClick={() => rejectConnection(post.owner)}
                  startDecorator={<X />}
                />
              </Tooltip>
            </Box>
          )}

          {localStatus === "connected" && (
            <Button disabled variant="plain">
              Connected
            </Button>
          )}
        </>
      )}
    </>
  );
}
