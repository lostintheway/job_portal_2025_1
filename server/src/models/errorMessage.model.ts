class ErrorMessage {
  static authRequired(): any {
    return { success: false, error: "Authentication required" };
  }
  //authfailed
  static authFailed(): any {
    return { success: false, error: "Authentication failed" };
  }
  static notFound(): any {
    return { success: false, error: "Data not found" };
  }
  static forbidden(): any {
    return { success: false, error: "Forbidden" };
  }
  static badRequest(): any {
    return { success: false, error: "Bad request" };
  }
  static serverError(): any {
    return { success: false, error: "Server error" };
  }
}

export default ErrorMessage;
