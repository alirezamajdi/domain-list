import { apiSlice } from "./apiSlice";
import { Domain, DomainStatus } from "../../types/domain";

export const domainApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all domains with optional filtering
    getDomains: builder.query<
      Domain[],
      { status?: DomainStatus; isActive?: boolean }
    >({
      query: (params) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Domain" as const, id })),
              { type: "Domain", id: "LIST" },
            ]
          : [{ type: "Domain", id: "LIST" }],
    }),

    // Get a single domain by ID
    getDomainById: builder.query<Domain, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Domain", id }],
    }),

    // Create a new domain
    createDomain: builder.mutation<
      Domain,
      Omit<Domain, "id" | "createdDate" | "updatedDate">
    >({
      query: (domain) => ({
        url: "",
        method: "POST",
        body: domain,
      }),
      invalidatesTags: [{ type: "Domain", id: "LIST" }],
    }),

    // Update an existing domain
    updateDomain: builder.mutation<Domain, Partial<Domain> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Domain", id },
        { type: "Domain", id: "LIST" },
      ],
    }),

    // Delete a domain
    deleteDomain: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Domain", id },
        { type: "Domain", id: "LIST" },
      ],
    }),

    // Update domain status
    updateDomainStatus: builder.mutation<
      Domain,
      { id: string; status: DomainStatus }
    >({
      query: ({ id, status }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Domain", id },
        { type: "Domain", id: "LIST" },
      ],
    }),

    // Toggle domain active state
    toggleDomainActive: builder.mutation<
      Domain,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Domain", id },
        { type: "Domain", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDomainsQuery,
  useGetDomainByIdQuery,
  useCreateDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
  useUpdateDomainStatusMutation,
  useToggleDomainActiveMutation,
} = domainApiSlice;
