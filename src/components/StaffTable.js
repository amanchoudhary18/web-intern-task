import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./StaffTable.css";
import { Button } from "@mui/material";

function StaffTable({ data, deleteStaff, addRole }) {
  const buttonStyle = {
    color: "black",
    border: "1.5px solid black",
    textDecoration: "none",
    textTransform: "capitalize",
  };

  const handleAddRole = (staff) => {
    addRole(staff);
  };

  const handleRemoveRole = (staff) => {
    // removeRole(staff);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow className="table-header">
            <TableCell className="table-header-row">Staff</TableCell>
            <TableCell className="table-header-row">Mobile Number</TableCell>
            <TableCell className="table-header-row">Role</TableCell>
            <TableCell className="table-header-row"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="table-row">
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.mobileNumber}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell className="table-cell">
                <div
                  className="button-container"
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    gap: "15px",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    className="hover-button"
                    sx={{
                      color: "red",
                      border: "1.5px solid red",
                      textDecoration: "none",
                      textTransform: "capitalize",
                    }}
                    onClick={() => deleteStaff(row.id)}
                  >
                    Delete Staff
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    className="hover-button"
                    style={buttonStyle}
                  >
                    Rename Staff
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    className="hover-button"
                    style={{ ...buttonStyle, width: "162px" }}
                    onClick={
                      row.role === "No Role"
                        ? () => handleAddRole(row)
                        : handleRemoveRole(row)
                    }
                  >
                    {row.role !== "No Role" ? "Remove Role" : "Add Role"}
                  </Button>

                  {row.role !== "No Role" && (
                    <Button
                      variant="outlined"
                      color="error"
                      className="hover-button"
                      style={buttonStyle}
                    >
                      Change Role
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StaffTable;
