import { useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [count, setCount] = useState(0);

  const handleOpenLink = () => {
    Linking.openURL("https://ecclesia.org.br/");
  };

  return (
    <View style={styles.container}>
      {/* CRUZ ORTODOXA */}
      <Image 
        source={require("../../assets/cross.png")} 
        style={styles.symbol}
        resizeMode="contain"
      />

      {/* BOTÃO / FUNDO DO CONTADOR */}
      <TouchableOpacity 
        style={styles.counterBox}
        activeOpacity={0.7}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.counter}>{count}</Text>
        <Text style={styles.counterHint}>Toque para contar</Text>
      </TouchableOpacity>

      {/* BARRA INFERIOR (Zerar em cima, link embaixo) */}
      <View style={styles.bottomBar}>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setCount(0)}
        >
          <Text style={styles.resetText}>Zerar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={handleOpenLink}
        >
          <Text style={styles.linkText}>
            Aprenda mais sobre a Ortodoxia
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    width: 140,
    height: 140,
    marginBottom: 40,
    opacity: 0.9,
  },
  // Fundo do contador
  counterBox: {
    backgroundColor: "#181818",
    paddingVertical: 24,
    paddingHorizontal: 60,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  counter: {
    fontSize: 80,
    color: "#E8E8E8",
    fontWeight: "bold",
  },
  counterHint: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
  },

  // BARRA INFERIOR — agora é coluna
  bottomBar: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  resetText: {
    color: "#cc4444",
    fontSize: 20,
  },

  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    color: "#4da3ff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
