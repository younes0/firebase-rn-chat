import { useMutation } from "@tanstack/react-query";

type CreateThreadParams = {
  peerId: string;
  userId: string;
};

export const useCreateThread = () =>
  useMutation({
    mutationFn: async (params: CreateThreadParams) => {
      const response = await fetch("/api/create-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: params }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return response.json();
    },
  });
