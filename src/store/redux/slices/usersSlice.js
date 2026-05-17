import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/api/userService";

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const data = await getUsers();
  return data;
});

export const addUser = createAsyncThunk("users/add", async (payload) => {
  const data = await createUser(payload);
  return data;
});

export const editUser = createAsyncThunk(
  "users/edit",
  async ({ id, payload }) => {
    const data = await updateUser(id, payload);
    return data;
  },
);

export const removeUser = createAsyncThunk("users/remove", async (id) => {
  await deleteUser(id);
  return id;
});

// ── Slice ─────────────────────────────────────────────────────
const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    // GET
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Gagal memuat data pengguna.";
      });

    // ADD
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    // EDIT
    builder.addCase(editUser.fulfilled, (state, action) => {
      const index = state.items.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    });

    // DELETE
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
    });
  },
});

export default usersSlice.reducer;
