type ErrorResponse = {
  message?: string | string[];
};

export const getErrorMessage = (response: unknown) => {
  if (
    response &&
    typeof response === "object" &&
    "message" in response &&
    response.message !== undefined
  ) {
    const { message } = response as ErrorResponse;

    if (Array.isArray(message) && message.length > 0) {
      return formatErrorMessage(message[0]);
    }
    
    if (typeof message === "string") {
      return formatErrorMessage(message);
}
  }

  return "Unknown error received";
};

const formatErrorMessage = (message: string) => {
  return message.charAt(0).toUpperCase() + message.slice(1);
};