"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { toast } from "sonner"

export function RoleFormModal({ open, onOpenChange, role, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        guardName: 'web'
    })

    useEffect(() => {

        if (open) {
            if (role) {
                setFormData({
                    name: role.name,
                    description: role.description || '',
                    guardName: role.guardName
                })
            } else {
                setFormData({
                    name: '',
                    description: '',
                    guardName: 'web'
                })
            }
        }
    }, [open, role])

    const isEditMode = Boolean(role?.id)

const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const toastId = toast.loading(isEditMode ? 'Updating role...' : 'Creating role...');

    try {
        // ✅ Temporary test
        console.log('Sending data:', formData);
        
        const url = isEditMode ? `/api/roles/${role.id}` : '/api/roles'
        const method = isEditMode ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (!response.ok || !result.success) {
            throw new Error(result.error?.message || `Failed to ${isEditMode ? 'update' : 'create'} role`);
        }

        toast.success(isEditMode ? 'Role updated successfully!' : 'Role created successfully!', {
            id: toastId
        });

        onSuccess();
        onOpenChange(false);

    } catch (error) {
        console.error('Role form error:', error);
        toast.error(error.message, {
            id: toastId
        });
    } finally {
        setLoading(false)
    }
}

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Edit Role' : 'Create New Role'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Role Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g., editor, manager"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Role description..."
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="guardName">Guard Name</Label>
                        <select
                            id="guardName"
                            value={formData.guardName}
                            onChange={(e) => handleChange('guardName', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            disabled={loading}
                        >
                            <option value="web">Web</option>
                            <option value="api">API</option>
                        </select>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="submit"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (isEditMode ? 'Update Role' : 'Create Role')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}