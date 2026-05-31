import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/api/productService";

// Async Thunks
export const fetchCourses = createAsyncThunk("courses/fetchAll", async () => {
  const data = await getProducts();
  return data;
});

export const addCourse = createAsyncThunk("courses/add", async (payload) => {
  const data = await createProduct(payload);
  return data;
});

export const editCourse = createAsyncThunk(
  "courses/edit",
  async ({ id, payload }) => {
    const data = await updateProduct(id, payload);
    return data;
  },
);

export const removeCourse = createAsyncThunk("courses/remove", async (id) => {
  await deleteProduct(id);
  return id;
});

// Slice
const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    // GET
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state) => {
        state.loading = false;
        state.error = "Gagal memuat kelas. Coba refresh halaman.";
      });

    // ADD
    builder.addCase(addCourse.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    // EDIT
    builder.addCase(editCourse.fulfilled, (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    });

    // DELETE
    builder.addCase(removeCourse.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    });
  },
});

export default coursesSlice.reducer;
