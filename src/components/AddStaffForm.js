import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const AddStaffForm = ({
  open,
  onClose,
  onAddStaff,
  onAddRole,
  stores,
  editData,
  onUpdate,
}) => {
  const BASE_URI = "http://stock.staging3.digitalregister.in:8080";
  const [staffName, setStaffName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [countryCode, setCountryCode] = useState("+91");
  const [isEditing, setIsEditing] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [editingData, setEditingData] = useState(null);

  const reset = () => {
    console.log("Reset");
    setStaffName("");
    setMobileNumber("");
    setSelectedRole(null);
    setSelectedStore(null);
    setCountryCode("+91");
  };

  const handleAddStaff = () => {
    onAddStaff({
      staffName,
      mobileNumber,
      selectedRole,
      selectedStore,
      countryCode,
    });
    reset();
  };

  const handleAddRole = () => {
    onUpdate({
      staffName,
      mobileNumber,
      selectedRole,
      selectedStore,
      countryCode,
      editingData,
      staffId,
    });
    reset();
  };

  const modalStyle = {
    display: "flex",
    flexDirection: "column",
    width: "1000px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  function extractCountryCodeAndNumber(mobileNumber) {
    const countryCodePattern = /^(\+91|\+1|\+44)/;

    const match = mobileNumber.match(countryCodePattern);

    if (match) {
      const code = match[0];
      const phoneNumber = mobileNumber.replace(code, "");

      return {
        code: code,
        mob: phoneNumber,
      };
    } else {
      return {
        code: "",
        mob: mobileNumber,
      };
    }
  }

  useEffect(() => {
    if (editData) {
      setIsEditing(true);
      setStaffId(editData.id);
      if (editData.name) {
        setStaffName(editData.name);
      }

      if (editData.mobileNumber) {
        const { code, mob } = {
          ...extractCountryCodeAndNumber(editData.mobileNumber),
        };
        setCountryCode(code ? code : "+91");
        setMobileNumber(mob);
      }

      if (editData.selectedStore) {
        setSelectedStore(editData.selectedStore);
      }

      if (editData.selectedRole) {
        setSelectedRole(editData.selectedRole);
      }
      setEditingData(editData);
    } else {
      setIsEditing(false);
      reset();
      setEditingData(null);
    }
  }, [editData]);

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      aria-labelledby="form-dialog-title"
    >
      <Box sx={modalStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditing ? "Edit Staff" : "Add Staff"}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{ alignSelf: "flex-end" }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <Box sx={{ width: "500px", marginRight: "55px" }}>
            <Typography variant="subtitle1">Staff Name *</Typography>
            <TextField
              autoFocus
              margin="dense"
              label={"Enter Here"}
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ width: "100px" }}>
            <Typography variant="subtitle1">Code</Typography>
            <Autocomplete
              options={["+91", "+1", "+44"]}
              value={countryCode}
              onChange={(e, newValue) => setCountryCode(newValue)}
              fullWidth
              clearIcon={null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=""
                  margin="dense"
                  InputProps={{
                    ...params.InputProps,
                    readOnly: true,
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ width: "440px" }}>
            <Typography variant="subtitle1">Mobile Number *</Typography>
            <TextField
              margin="dense"
              label={"Enter Here"}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              fullWidth
            />
          </Box>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <Box>
            <Typography variant="subtitle1">Store *</Typography>
            <Autocomplete
              options={stores}
              getOptionLabel={(store) => store.name}
              value={selectedStore}
              onChange={(e, newValue) => setSelectedStore(newValue)}
              fullWidth
              sx={{ width: "500px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Store"
                  margin="dense"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <>{params.InputProps.endAdornment}</>,
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1">Role *</Typography>
            <Autocomplete
              options={[
                "SALES_PURCHASE_MANAGER",
                "STORE_MANAGER",
                "SALES_MANAGER",
              ]}
              value={selectedRole}
              onChange={(e, newValue) => setSelectedRole(newValue)}
              sx={{ width: "500px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Role"
                  margin="dense"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: <>{params.InputProps.endAdornment}</>,
                  }}
                />
              )}
            />
          </Box>
        </div>

        <Box sx={{ mt: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={isEditing ? handleAddRole : handleAddStaff}
            variant="contained"
            color="primary"
            disabled={
              isEditing
                ? !selectedRole || !selectedStore
                : !staffName || !mobileNumber
            }
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddStaffForm;
