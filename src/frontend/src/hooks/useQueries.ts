import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Document, DocumentMeta } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllDocumentsMeta() {
  const { actor, isFetching } = useActor();
  return useQuery<DocumentMeta[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocumentsMeta();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDocument(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Document | null>({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getDocument(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      content: string;
      formatType: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.createDocument(
        params.id,
        params.title,
        params.content,
        params.formatType,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useUpdateDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateDocument(params.id, params.title, params.content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document", variables.id] });
    },
  });
}

export function useDeleteDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
