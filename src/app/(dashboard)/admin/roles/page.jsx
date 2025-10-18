"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RoleFormModal } from "@/components/roles/role-form-modal"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePagination } from "@/hooks/use-pagination"
import { PaginationSimple } from "@/components/pagination-simple"

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    const fetchRoles = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`/api/roles?page=${page}&limit=${limit}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error?.message || "Failed to fetch roles");

            setRoles(data.data || []);

            if (data.pagination) {
                setPagination(data.pagination);
            }

        } catch (err) {
            setError(err.message);
            toast.error("Failed to load roles");
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handlePageChange = (page) => {
        fetchRoles(page, pagination.itemsPerPage);
    };

    const handleSave = () => {
        fetchRoles(pagination.currentPage, pagination.itemsPerPage);
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        const toastId = toast.loading("Deleting role...");

        try {
            const res = await fetch(`/api/roles/${deletingId}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok || !data.success) throw new Error(data.error?.message || "Failed to delete role");

            toast.success("Role deleted successfully", { id: toastId });

            fetchRoles(pagination.currentPage, pagination.itemsPerPage);

        } catch (err) {
            toast.error(err.message, { id: toastId });
        } finally {
            setDeleteDialogOpen(false);
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Roles Management</h1>
                    <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
                </div>
                <Button onClick={() => { setEditingRole(null); setModalOpen(true) }}>Add Role</Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
            )}

            <Card>
                <CardHeader><CardTitle>System Roles</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Guard</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                            <p>Loading roles...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No roles found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map(role => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">{role.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span>{role.name}</span>
                                                {["super_admin", "admin"].includes(role.name) && (
                                                    <Badge variant="secondary">System</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{role.description || "-"}</TableCell>
                                        <TableCell><Badge variant="outline">{role.guardName}</Badge></TableCell>
                                        <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => { setEditingRole(role); setModalOpen(true) }}>
                                                Edit
                                            </Button>
                                            {!["super_admin", "admin"].includes(role.name) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={deletingId === role.id}
                                                    onClick={() => { setDeletingId(role.id); setDeleteDialogOpen(true) }}
                                                >
                                                    {deletingId === role.id ? "Deleting..." : "Delete"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {!loading && pagination.totalItems > 0 && (
                        <div className="border-t p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
                                </div>
                                <PaginationSimple
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <RoleFormModal open={modalOpen} onOpenChange={setModalOpen} role={editingRole} onSuccess={handleSave} />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
