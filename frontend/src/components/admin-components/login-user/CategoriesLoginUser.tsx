import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import {
  createLoginCategory,
  getLoginCategories,
  updateLoginCategory,
  deleteLoginCategory,
} from "@/services/loginCategoriesServices";
import { getLogins } from "@/services/loginServices";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMemo, useState } from "react";

export default function CategoriesLoginUser() {
  const { data: categories = [], setData: setCategories } = useApi(getLoginCategories, { autoFetch: true });
  const { fetch: postCategory } = useApi(createLoginCategory);
  const { fetch: patchCategory } = useApi(updateLoginCategory);
  const { fetch: removeCategory } = useApi(deleteLoginCategory);
  const { data: logins = [] } = useApi(getLogins, { autoFetch: true });
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deleting, setDeleting] = useState<(typeof categories)[number] | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => b.id - a.id),
    [categories],
  );

  const handleCreate = () => {
    const login_category = newName.trim();
    if (!login_category) return;
    postCategory({ login_category }, (created) => {
      setCategories((prev = []) => [...prev, created]);
      setNewName("");
    });
  };

  const handleSave = (id: number) => {
    const login_category = editName.trim();
    if (!login_category) return;
    patchCategory({ id, changes: { login_category } }, (updated) => {
      setCategories((prev = []) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    });
  };

  const askDelete = (category: (typeof categories)[number]) => {
    const inUse = logins.some((l) => l.type_login_id === category.id);
    if (inUse) {
      toast.error(`La categoría "${category.login_category}" está en uso y no se puede eliminar.`);
      return;
    }
    setDeleting(category);
  };

  const handleDelete = () => {
    if (!deleting) return;
    const { id } = deleting;
    removeCategory(id, () => {
      setCategories((prev = []) => prev.filter((c) => c.id !== id));
      setDeleting(null);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoría"
        />
        <Button onClick={handleCreate}>Agregar</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categorías de usuario del sistema</TableHead>
            <TableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCategories.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                {editingId === c.id ? (
                  <Input
                    aria-label="editar-categoria"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  c.login_category
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {editingId === c.id ? (
                    <Button size="sm" onClick={() => handleSave(c.id)}>Guardar</Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditName(c.login_category);
                      }}
                    >
                      Editar
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => askDelete(c)}>
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar categoría</DialogTitle>
            <DialogDescription>
              ¿Seguro que querés eliminar la categoría {deleting?.login_category}? Esta acción no se puede deshacer.
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
    </div>
  );
}
