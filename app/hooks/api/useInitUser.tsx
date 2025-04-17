import { useMutation } from "@tanstack/react-query";

export const useInitUser = () =>
  useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch("/api/init-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { userId } }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return response.json();
    },
  });
