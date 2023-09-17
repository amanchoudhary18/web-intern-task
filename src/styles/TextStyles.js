import Typography from "@mui/material/Typography";

export const Heading1 = ({ text }) => (
  <Typography
    variant="body-1"
    style={{
      color: "#000",
      fontFamily: "Roboto",
      fontSize: "24px",
      fontWeight: 500,
    }}
  >
    {text}
  </Typography>
);

export const PrimaryButtonText = ({ text }) => (
  <Typography
    variant="button-text-1"
    style={{
      color: "#FFF",
      textAlign: "center",
      fontFamily: "Roboto",
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "normal",
      textTransform: "capitalize",
    }}
  >
    {text}
  </Typography>
);
