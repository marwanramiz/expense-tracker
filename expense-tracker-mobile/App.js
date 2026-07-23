import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import API from "./src/api";
import Login from "./src/Login";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      API.get("/api/expenses/1")
        .then(res => setExpenses(res.data))
        .catch(err => console.log(err));
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.category}: ₹{item.amount}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: { fontSize: 18, marginBottom: 10 }
});
