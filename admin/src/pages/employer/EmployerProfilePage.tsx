import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmployerProfile {
  profileId: number;
  userId: number;
  companyName: string;
  industry: string;
  companySize: string;
  founded: string;
  website: string;
  location: string;
  about: string;
  mission: string;
  benefits: string;
  logo: string;
}

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api
        .getInstance()
        .get("/api/employer-profile/my-profile");
      setProfile(response.data.data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load company profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      if (profile.profileId) {
        // Update existing profile
        await api
          .getInstance()
          .put(`/api/employer-profile/${profile.profileId}`, profile);
        toast.success("Company profile updated successfully");
      } else {
        // Create new profile
        const response = await api
          .getInstance()
          .post("/api/employer-profile", profile);
        setProfile(response.data.data);
        toast.success("Company profile created successfully");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving company profile:", error);
      toast.error("Failed to save company profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Company Profile</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardHeader>
        <CardContent>
          {!profile && !isEditing ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't created a company profile yet
              </p>
              <Button onClick={() => setIsEditing(true)}>Create Profile</Button>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={profile?.companyName || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Corporation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={profile?.industry || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Technology, Healthcare, Finance"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Input
                  id="companySize"
                  name="companySize"
                  value={profile?.companySize || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 1-10, 11-50, 51-200, 201-500, 501+"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded">Founded</Label>
                <Input
                  id="founded"
                  name="founded"
                  value={profile?.founded || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 2010"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={profile?.website || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. https://www.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profile?.location || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Sydney, Australia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Company</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={profile?.about || ""}
                  onChange={handleInputChange}
                  placeholder="Describe your company, its history, and what it does"
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Company Mission</Label>
                <Textarea
                  id="mission"
                  name="mission"
                  value={profile?.mission || ""}
                  onChange={handleInputChange}
                  placeholder="What is your company's mission and vision?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  value={profile?.benefits || ""}
                  onChange={handleInputChange}
                  placeholder="List benefits and perks offered to employees"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={profile?.logo || ""}
                  onChange={handleInputChange}
                  placeholder="URL to your company logo"
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Company Name</h3>
                <p className="text-gray-700">{profile?.companyName}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-md font-semibold">Industry</h3>
                  <p className="text-gray-700">{profile?.industry}</p>
                </div>
                <div>
                  <h3 className="text-md font-semibold">Company Size</h3>
                  <p className="text-gray-700">{profile?.companySize}</p>
                </div>
                <div>
                  <h3 className="text-md font-semibold">Founded</h3>
                  <p className="text-gray-700">{profile?.founded}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-md font-semibold">Website</h3>
                  <p className="text-gray-700">
                    {profile?.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.website}
                      </a>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-semibold">Location</h3>
                  <p className="text-gray-700">{profile?.location}</p>
                </div>
              </div>

              {profile?.about && (
                <div>
                  <h3 className="text-lg font-semibold">About Company</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.about}
                  </p>
                </div>
              )}

              {profile?.mission && (
                <div>
                  <h3 className="text-lg font-semibold">Company Mission</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.mission}
                  </p>
                </div>
              )}

              {profile?.benefits && (
                <div>
                  <h3 className="text-lg font-semibold">Benefits & Perks</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.benefits}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
