 
import { useState } from "react";
import { TextInput, TouchableOpacity, View, Text } from "react-native";

const Index = () => {
  const BACKEND_APP_ORIGIN = "http://10.0.2.2:3000";
  const [slideIndex, setSlideIndex] = useState(0);
  const [user, setUser] = useState({
    role: "",  
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const inputChangeHandler = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const registration = async () => {
    const formData = {
      name: user.name,
      email: user.email,
      phoneNumber: Number(user.phoneNumber),
      password: user.password,
      role: user.role,
    };

    try {
      const resp = await fetch(`${BACKEND_APP_ORIGIN}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await resp.json();
      if (result) {
        // Reset the form on success if needed.
        setUser({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          role: user.role, // keep the selected role if desired
        });
        console.log("Registration successful:", result);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      {slideIndex === 0 ? (
        // Slide 0: Role Selection and Join Button
        <View>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>Select Your Role</Text>
          {/* Role Option: User */}
          <TouchableOpacity
            onPress={() => inputChangeHandler("role", "user")}
            style={{
              borderWidth: 1,
              borderColor: user.role === "user" ? "#f95a2c" : "#000",
              marginBottom: 8,
              padding: 8,
            }}
          >
            <Text>User</Text>
          </TouchableOpacity>
          {/* Role Option: Admin */}
          <TouchableOpacity
            onPress={() => inputChangeHandler("role", "admin")}
            style={{
              borderWidth: 1,
              borderColor: user.role === "admin" ? "#f95a2c" : "#000",
              marginBottom: 8,
              padding: 8,
            }}
          >
            <Text>Admin</Text>
          </TouchableOpacity>
          {/* Role Option: Ambassador */}
          <TouchableOpacity
            onPress={() => inputChangeHandler("role", "ambassador")}
            style={{
              borderWidth: 1,
              borderColor: user.role === "ambassador" ? "#f95a2c" : "#000",
              marginBottom: 8,
              padding: 8,
            }}
          >
            <Text>Ambassador</Text>
          </TouchableOpacity>
          {/* Button to move to Slide 1 */}
          <TouchableOpacity
            onPress={() => setSlideIndex(1)}
            style={{
              backgroundColor: "#f95a2c",
              padding: 12,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Join</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Slide 1: Remaining Form Fields with a back ("<") button
        <View>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => setSlideIndex(0)}
            style={{
              marginBottom: 12,
              padding: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ fontSize: 18 }}>{'<'}</Text>
          </TouchableOpacity>
          <TextInput
            value={user.name}
            placeholder="Enter name"
            onChangeText={(text) => inputChangeHandler("name", text)}
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <TextInput
            value={user.email}
            placeholder="Enter email"
            onChangeText={(text) => inputChangeHandler("email", text)}
            keyboardType="email-address"
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <TextInput
            value={user.phoneNumber}
            placeholder="Enter phone number"
            onChangeText={(text) => inputChangeHandler("phoneNumber", text)}
            keyboardType="phone-pad"
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <TextInput
            value={user.password}
            placeholder="Enter password"
            onChangeText={(text) => inputChangeHandler("password", text)}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
          />
          <TouchableOpacity
            onPress={registration}
            style={{
              backgroundColor: "#f95a2c",
              padding: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Index;
