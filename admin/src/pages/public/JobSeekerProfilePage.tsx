import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JobSeekerProfile {
  profileId: number;
  userId: number;
  headline: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
}

export default function JobSeekerProfilePage() {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
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
        .get("/api/jobseeker-profile/my-profile");
      setProfile(response.data.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load profile"
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (profile) {
      setProfile({
        ...profile,
        [name]: checked,
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
          .put(`/api/jobseeker-profile/${profile.profileId}`, profile);
        toast.success("Profile updated successfully");
      } else {
        // Create new profile
        const response = await api
          .getInstance()
          .post("/api/jobseeker-profile", profile);
        setProfile(response.data.data);
        toast.success("Profile created successfully");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
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
          <CardTitle>Job Seeker Profile</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardHeader>
        <CardContent>
          {!profile && !isEditing ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't created a profile yet
              </p>
              <Button onClick={() => setIsEditing(true)}>Create Profile</Button>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  value={profile?.headline || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer with 5+ years experience"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={profile?.summary || ""}
                  onChange={handleInputChange}
                  placeholder="Brief overview of your professional background and career goals"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={profile?.experience || ""}
                  onChange={handleInputChange}
                  placeholder="List your work experience"
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  name="education"
                  value={profile?.education || ""}
                  onChange={handleInputChange}
                  placeholder="List your educational background"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={profile?.skills || ""}
                  onChange={handleInputChange}
                  placeholder="List your key skills"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <Input
                  id="languages"
                  name="languages"
                  value={profile?.languages || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. English (Fluent), Spanish (Intermediate)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={profile?.isPublic || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPublic">
                  Make profile public to employers
                </Label>
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
                <h3 className="text-lg font-semibold">Professional Headline</h3>
                <p className="text-gray-700">{profile?.headline}</p>
              </div>

              {profile?.summary && (
                <div>
                  <h3 className="text-lg font-semibold">
                    Professional Summary
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.summary}
                  </p>
                </div>
              )}

              {profile?.experience && (
                <div>
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.experience}
                  </p>
                </div>
              )}

              {profile?.education && (
                <div>
                  <h3 className="text-lg font-semibold">Education</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.education}
                  </p>
                </div>
              )}

              {profile?.skills && (
                <div>
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {profile.skills}
                  </p>
                </div>
              )}

              {profile?.languages && (
                <div>
                  <h3 className="text-lg font-semibold">Languages</h3>
                  <p className="text-gray-700">{profile.languages}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold">Profile Visibility</h3>
                <p className="text-gray-700">
                  {profile?.isPublic
                    ? "Public - Visible to employers"
                    : "Private - Not visible to employers"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
