import { GetSlidersQueryParams, Slide, SliderResponse } from "@/utils/Types";
import { sliderSlice } from "./apiSlider";

 

 

export const sliderApi = sliderSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query<SliderResponse, GetSlidersQueryParams>({
      query: ({ page = 1, limit = 10,  lang }) => ({
        url: '/api/slider',
        params: { page, limit,   ...(lang && { lang }) },
      }),
      providesTags: ['Slider'],
    }),
    getSingleSlider: builder.query<Slide, { id: string; lang?: string }>({
      query: ({ id, lang }) => ({
        url: `/api/slider/${id}`,
        params: lang ? { lang } : {},
      }),
      providesTags: ['Slider'],
    }),
    deleteSlider: builder.mutation({
      query: (id: string) => ({
        url: `/api/slider/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Slider'],
    }),
    createSlider: builder.mutation<Slide, FormData>({
      query: (formData) => ({
        url: '/api/slider/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Slider'],
    }),
    updateSlider: builder.mutation<Slide, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/slider/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Slider'],
    }),
  }),
});

export const { 
  useGetSlidersQuery, 
  useGetSingleSliderQuery, 
  useDeleteSliderMutation, 
  useCreateSliderMutation, 
  useUpdateSliderMutation 
} = sliderApi;
