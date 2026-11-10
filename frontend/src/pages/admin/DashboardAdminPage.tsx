import CategoriesLoginUser from "@/components/admin-components/login-user/CategoriesLoginUser";
import CreateLoginUser from "@/components/admin-components/login-user/CreateLoginUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DashboardAdminPage() {
  return (
    <div className="w-full mx-auto py-6 space-y-4">
      <Tabs defaultValue="items" className={"w-full space-y-4"}>
        <TabsList className={"grid w-full grid-cols-2"}>
          <TabsTrigger value="login-user">Gestionar usuario para login</TabsTrigger>
          <TabsTrigger value="login-categories">Gestionar sus categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="login-user">
          <CreateLoginUser />
        </TabsContent>


        <TabsContent value="login-categories">
          <CategoriesLoginUser />
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default DashboardAdminPage





