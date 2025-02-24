import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Profile {
  profileId: number;
  name: string;
  bio: string;
  skills: string;
  createdDate: string;
}

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/profiles`);
        setProfiles(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profileData = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      skills: formData.get("skills"),
    };

    try {
      await axios.post(`${BASE_URL}/api/profiles`, profileData);
      // Refresh the list
      const response = await axios.get(`${BASE_URL}/api/profiles`);
      setProfiles(response.data.data);
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold">Profiles</h2>
        </CardHeader>
        <div className="p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">Create New Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" required />
                </div>
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Input id="skills" name="skills" required />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="grid gap-4">
            {profiles.map((profile) => (
              <Card key={profile.profileId} className="p-4">
                <h3 className="font-bold">{profile.name}</h3>
                <p className="mt-2">{profile.bio}</p>
                <p className="mt-2">Skills: {profile.skills}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(profile.createdDate).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilesPage;
