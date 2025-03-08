import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { User } from "../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.getMyProfile();
      setProfile(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateUser(profile!.userId.toString(), formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
