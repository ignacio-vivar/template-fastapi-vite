import { useMemo, useState } from "react";
import {
  flexRender,
  tableFeatures,
  useTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditableCell } from "@/components/table-components/EditableCell";
import { ComboboxField } from "@/components/table-components/ComboboxField";
import { KeyRound, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/useApi";
import {
  createLogin,
  deleteLogin,
  getLogins,
  updateLogin,
} from "@/services/loginServices";
import { getLoginCategories } from "@/services/loginCategoriesServices";
import type { Login, LoginUpdate } from "@/models/login.model";
import { usePagination } from "@/hooks/usePagination";
import { TablePagination } from "@/components/table-components/TablePagination";

const features = tableFeatures({});

export default function CreateLoginUser() {
  const { data: rows = [], setData: setRows } = useApi(getLogins, { autoFetch: true });
  const { data: categories = [] } = useApi(getLoginCategories, { autoFetch: true });
  const { fetch: postLogin } = useApi(createLogin);
  const { fetch: patchLogin } = useApi(updateLogin);
  const { fetch: removeLogin } = useApi(deleteLogin);

  // alta
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");

  // filtro
  const [fName, setFName] = useState("");

  // diálogos
  const [deleting, setDeleting] = useState<Login | null>(null);
  const [changingPwd, setChangingPwd] = useState<Login | null>(null);
  const [pwd, setPwd] = useState("");

  const categoryOptions = useMemo(
    () =>
      categories.map((c) => ({
        value: String(c.id),
        label: c.login_category,
      })),
    [categories],
  );

  const visibleRows = useMemo(() => {
    const q = fName.trim().toLowerCase();
    return rows
      .filter((r) => !q || r.username.toLowerCase().includes(q))
      .sort((a, b) => b.id - a.id);
  }, [rows, fName]);

  const handleCreate = () => {
    const username = newUsername.trim();
    if (!username || !newPassword || !newCategoryId) {
      toast.error("Completá usuario, contraseña y categoría.");
      return;
    }
    postLogin(
      { username, password: newPassword, type_login_id: Number(newCategoryId) },
      (created) => {
        setRows((prev = []) => [...prev, created]);
        setNewUsername("");
        setNewPassword("");
        setNewCategoryId("");
      },
    );
  };

  const handleSave = (id: number, changes: LoginUpdate) => {
    patchLogin({ id, changes }, (updated) =>
      setRows((prev = []) => prev.map((r) => (r.id === id ? updated : r))),
    );
  };

  const handleChangePassword = () => {
    if (!changingPwd) return;
    if (!pwd) {
      toast.error("La contraseña no puede estar vacía.");
      return;
    }
    patchLogin({ id: changingPwd.id, changes: { password: pwd } }, () => {
      toast.success(`Contraseña de ${changingPwd.username} actualizada.`);
      setChangingPwd(null);
      setPwd("");
    });
  };


  const handleDelete = () => {
    if (!deleting) return;
    const { id } = deleting;
    removeLogin(id, () => {
      setRows((prev = []) => prev.filter((r) => r.id !== id));
      setDeleting(null);
    });
  };

  const columns = useMemo<ColumnDef<typeof features, Login>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Usuario",
        cell: ({ row }) => (
          <EditableCell
            ariaLabel="username-edit"
            value={row.original.username}
            onSave={(username) => handleSave(row.original.id, { username })}
          />
        ),
      },
      {
        id: "category",
        header: "Categoría",
        cell: ({ row }) => (
          <div className="mx-auto w-40">
            <ComboboxField
              ariaLabel="login-category-edit"
              options={categoryOptions}
              value={String(row.original.type_login_id)}
              onChange={(v) =>
                v && handleSave(row.original.id, { type_login_id: Number(v) })
              }
              placeholder="Categoría"
              className="w-full"
            />
          </div>
        ),
      },
      {
        id: "password",
        header: "Contraseña",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={() => {
                setPwd("");
                setChangingPwd(row.original);
              }}
            >
              <KeyRound className="h-4 w-4" />
              Cambiar
            </Button>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Eliminar</span>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              aria-label="Eliminar"
              onClick={() => setDeleting(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [categoryOptions],
  );

  const { pageRows, paginationProps } = usePagination(visibleRows);
  const table = useTable({ features, columns, data: pageRows });

  return (
    <div className="flex flex-col">
      {/* confirmación de borrado */}
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar al usuario {deleting?.username}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* cambio de contraseña */}
      <Dialog open={!!changingPwd} onOpenChange={(open) => !open && setChangingPwd(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            <DialogDescription>
              Nueva contraseña para {changingPwd?.username}.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            autoComplete="new-password"
            aria-label="nueva-contraseña"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Nueva contraseña"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangingPwd(null)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* alta */}
      <div className="grid grid-cols-1 items-center gap-3 p-5 my-5 border rounded-lg shadow-xs shadow-red-300 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <Input
          aria-label="new-username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Usuario"
        />
        <Input
          aria-label="new-password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <ComboboxField
          ariaLabel="new-login-category"
          options={categoryOptions}
          value={newCategoryId}
          onChange={setNewCategoryId}
          placeholder="Categoría"
          className="w-full"
        />
        <Button onClick={handleCreate} className="px-5">
          Agregar
        </Button>
      </div>

      {/* filtro */}
      <div className="mb-5 rounded-lg border border-sky-500/30 bg-sky-500/5 p-3 w-[50vw]">
        <div className="mb-2 text-right text-xs text-muted-foreground">Filtros</div>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Usuario</label>
            <Input
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="Buscar por usuario"
            />
          </div>
          {fName && (
            <Button variant="ghost" onClick={() => setFName("")}>
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination {...paginationProps} />
    </div>
  );
}
