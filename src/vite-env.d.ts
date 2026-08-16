/// <reference types="vite/client" />

declare module "@/store/employeeStore" {
  const useEmployeeStore: any;
  export default useEmployeeStore;
}

declare module "@/store/employerStore" {
  const useEmployerStore: any;
  export default useEmployerStore;
}

declare module "../../store/authStore" {
  const useAuthStore: any;
  export default useAuthStore;
}
