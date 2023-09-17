import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Chip from "@mui/material/Chip";
import StaffTable from "./StaffTable";
import AddStaffForm from "./AddStaffForm";

import { Heading1, PrimaryButtonText } from "../styles/TextStyles";
import axios from "axios";

const ManageStaff = () => {
  const BASE_URI = "http://stock.staging3.digitalregister.in:8080";
  const business_id = "VgwLq1sKrUdkxsSuTKEhEF5b8KG3";
  const [selectedChip, setSelectedChip] = useState(0);
  const [staffData, setStaffData] = useState([]);
  const [noRoleData, setnoRoleData] = useState([]);
  const [openAddStaffForm, setOpenAddStaffForm] = useState(false);
  const [stores, setStores] = useState([]);
  const [editData, setEditData] = useState(null);

  const handleChipClick = (index) => {
    setSelectedChip(index);
  };

  const handleOpenAddStaffForm = () => {
    setOpenAddStaffForm(true);
  };

  const handleCloseAddStaffForm = () => {
    setEditData(null);
    setOpenAddStaffForm(false);
  };

  const handleAddRole = (staff) => {
    setEditData({
      name: staff.name,
      mobileNumber: staff.mobileNumber,
      id: staff.id,
    });

    handleOpenAddStaffForm();
  };

  // const handleRemoveRole = (staff) => {
  //   console.log(staff);

  //   handleOpenAddStaffForm();
  // };
  const submitUpdate = async (data) => {
    const {
      staffName,
      mobileNumber,
      selectedRole,
      selectedStore,
      countryCode,
      editingData,
      staffId,
    } = { ...data };

    try {
      if (editingData.selectedRole && editingData.selectedStore) {
      } else {
        console.log({
          access_type: selectedRole,
          staffId: staffId,
          storeId: selectedStore.storeId,
        });
        const response = await axios.post(
          `${BASE_URI}/api/v1/staffAccess/add`,
          {
            access_type: selectedRole,
            staffId: staffId,
            storeId: selectedStore.storeId,
          }
        );

        console.log(response.data);
        fetchStaff(selectedStore.storeId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseAddStaffForm();
    }
  };

  const handleAddStaff = async (newStaff) => {
    setEditData({});
    const response = await axios.post(`${BASE_URI}/api/v1/staff/add`, {
      businessId: business_id,
      name: newStaff.staffName,
      phone: newStaff.countryCode + newStaff.mobileNumber,
    });

    if (newStaff.selectedStore && newStaff.selectedRole) {
      await axios.post(`${BASE_URI}/api/v1/staffAccess/add`, {
        access_type: newStaff.selectedRole,
        staffId: response.data.staffId,
        storeId: newStaff.selectedStore.storeId,
      });

      fetchStaff(newStaff.selectedStore.storeId);
    } else {
      fetchStaff(stores[selectedChip].storeId);
    }

    handleCloseAddStaffForm();
  };

  const fetchAllStores = async () => {
    const response = await axios.get(
      `${BASE_URI}/api/v2/store/getStore/${business_id}`
    );

    setStores(response.data.response);
    fetchStaff(response.data.response[0].storeId);
  };

  const fetchStaff = async (storeId) => {
    const response = await axios.get(
      `${BASE_URI}/api/v2/staffAccess/get/${storeId}`
    );

    const staffApiResponse = [];

    const roleAssignedStaffs = [];
    response.data.salesManagerModels.forEach((e) => {
      const staff = {
        name: e.staffModel.name,
        mobileNumber: e.staffModel.mobile,
        id: e.staffModel.staffId,
        role: "SALES MANAGER",
        manager: e.salesManagerId,
      };

      roleAssignedStaffs.push(e.staffModel.staffId);

      staffApiResponse.push(staff);
    });

    response.data.salesPurchaseManagerModels.forEach((e) => {
      const staff = {
        name: e.staffModel.name,
        mobileNumber: e.staffModel.mobile,
        id: e.staffModel.staffId,
        role: "SALES PURCHASE MANAGER",
        manager: e.salesPurchaseManagerId,
      };
      roleAssignedStaffs.push(e.staffModel.staffId);
      staffApiResponse.push(staff);
    });

    response.data.storeManagerModels.forEach((e) => {
      const staff = {
        name: e.staffModel.name,
        mobileNumber: e.staffModel.mobile,
        id: e.staffModel.staffId,
        role: "STORE MANAGER",
        manager: e.storeManagerId,
      };
      roleAssignedStaffs.push(e.staffModel.staffId);
      staffApiResponse.push(staff);
    });

    setStaffData(staffApiResponse);
    fetchNoRoleStaff(roleAssignedStaffs);
  };

  const deleteStaff = async (staffId, storeId) => {
    const response = await axios.delete(
      `${BASE_URI}/api/v1/staff/delete/${staffId}`
    );

    fetchStaff(stores[selectedChip].storeId);
  };

  const fetchNoRoleStaff = async (roleAssignedStaffs) => {
    try {
      const response = await axios.post(`${BASE_URI}/api/v1/staff/get`, {
        businessIds: ["VgwLq1sKrUdkxsSuTKEhEF5b8KG3"],
      });
      const noRole = [];

      response.data.response.forEach((e) => {
        if (!roleAssignedStaffs.includes(e.staffId)) {
          const staff = {
            name: e.name,
            mobileNumber: e.mobile,
            id: e.staffId,
            role: "No Role",
          };

          noRole.push(staff);
        }
      });
      setnoRoleData(noRole);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllStores();
  }, []);

  return (
    <div>
      {/* Header */}
      <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <Heading1 text={"Manage Staff"} />
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "5px",
              background: "#1602FF",
              padding: "5px 45px",
            }}
            onClick={handleOpenAddStaffForm}
          >
            <PrimaryButtonText text={"Add Staff"} />
          </Button>
        </Toolbar>
      </AppBar>

      {/* Stores */}

      <div style={{ background: "#F8F8FF", padding: "20px" }}>
        <div style={{ paddingBottom: "20px" }}>
          {stores.map((item, index) => (
            <Chip
              key={index}
              label={item.name}
              color={selectedChip === index ? "primary" : "secondary"}
              variant={selectedChip === index ? "contained" : "outlined"}
              style={{ margin: "4px" }}
              sx={{
                border: `${selectedChip === index ? "" : "1px solid #AB8484;"}`,
              }}
              onClick={() => {
                handleChipClick(index);
                fetchStaff(item.storeId);
              }}
            />
          ))}
        </div>

        <StaffTable
          data={[...staffData, ...noRoleData]}
          deleteStaff={deleteStaff}
          addRole={handleAddRole}
        />
      </div>

      <AddStaffForm
        open={openAddStaffForm}
        onClose={handleCloseAddStaffForm}
        onAddStaff={handleAddStaff}
        stores={stores}
        editData={editData}
        onUpdate={submitUpdate}
      />
    </div>
  );
};

export default ManageStaff;
