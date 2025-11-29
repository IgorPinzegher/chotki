import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Configurações Padrão
const CYCLE_SIZE = 33; // Tamanho do Chotki (33, 50 ou 100)
const PRAYER_TEXT = "Senhor Jesus Cristo, Filho de Deus,\ntem misericórdia de mim, pecador.";

export default function Index() {
  // Estados
  const [count, setCount] = useState(0); // Contagem atual do ciclo
  const [rounds, setRounds] = useState(0); // Quantas voltas completas
  const [showPrayer, setShowPrayer] = useState(true); // Mostrar/Ocultar texto

  // 1. CARREGAR DADOS (Persistência)
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCount = await AsyncStorage.getItem("@chotki_count");
        const storedRounds = await AsyncStorage.getItem("@chotki_rounds");
        const storedShow = await AsyncStorage.getItem("@chotki_show_text");

        if (storedCount) setCount(parseInt(storedCount));
        if (storedRounds) setRounds(parseInt(storedRounds));
        if (storedShow !== null) setShowPrayer(JSON.parse(storedShow));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    };
    loadData();
  }, []);

  // 2. SALVAR DADOS (Sempre que mudarem)
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("@chotki_count", count.toString());
        await AsyncStorage.setItem("@chotki_rounds", rounds.toString());
        await AsyncStorage.setItem("@chotki_show_text", JSON.stringify(showPrayer));
      } catch (e) {
        console.error("Erro ao salvar dados", e);
      }
    };
    saveData();
  }, [count, rounds, showPrayer]);

  // 3. LÓGICA DE CONTAGEM E VIBRAÇÃO (Haptics e Ciclos)
  const handlePray = useCallback(async () => {
    // Feedback Tátil Leve (simula passar uma conta)
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (count + 1 === CYCLE_SIZE) {
      // Completou um ciclo (Ex: 33)
      // Feedback Tátil Pesado (simula o nó principal/cruz)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRounds((prev) => prev + 1);
      setCount(0);
    } else {
      // Contagem normal
      setCount((prev) => prev + 1);
    }
  }, [count]);

  const handleReset = () => {
    Alert.alert("Zerar Contador", "Deseja zerar o ciclo atual ou tudo?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Só o Ciclo", 
        onPress: () => setCount(0) 
      },
      { 
        text: "Tudo (Voltas)", 
        style: "destructive", 
        onPress: () => { setCount(0); setRounds(0); } 
      }
    ]);
  };

  const handleOpenLink = () => {
    Linking.openURL("https://ecclesia.org.br/");
  };

  return (
    // "Pressable" no container permite tocar em qualquer lugar da tela preta para contar (Ergonomia)
    <Pressable style={styles.container} onPress={handlePray}>
      
      {/* 4. EXIBIÇÃO DA ORAÇÃO (Opcional) */}
      <View style={styles.header}>
        {showPrayer && (
          <Text style={styles.prayerText}>{PRAYER_TEXT}</Text>
        )}
      </View>

      <View style={styles.centerContent}>
        {/* CRUZ ORTODOXA */}
        <Image 
          source={require("../../assets/cross.png")} 
          style={styles.symbol}
          resizeMode="contain"
        />

        {/* CONTADOR PRINCIPAL */}
        <View style={styles.counterBox}>
          <Text style={styles.counter}>{count}</Text>
          <Text style={styles.counterHint}>/{CYCLE_SIZE}</Text>
        </View>

        {/* CONTADOR DE VOLTAS (Ciclos) */}
        <View style={styles.roundsContainer}>
          <Text style={styles.roundsText}>Voltas completas: {rounds}</Text>
        </View>
      </View>

      {/* BARRA INFERIOR */}
      <View style={styles.bottomBar}>
        
        {/* Controles de Interface */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => setShowPrayer(!showPrayer)} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>
              {showPrayer ? "Ocultar Texto" : "Mostrar Texto"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} style={styles.smallButton}>
            <Text style={[styles.smallButtonText, { color: "#cc4444" }]}>Zerar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
          <Text style={styles.linkText}>Aprenda mais sobre a Ortodoxia</Text>
        </TouchableOpacity>

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    justifyContent: "space-between", // Distribui entre topo, meio e fim
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  prayerText: {
    color: "#A0A0A0",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    width: 100,
    height: 100,
    marginBottom: 30,
    opacity: 0.8,
    tintColor: "#333", // Deixa a cruz mais sutil no fundo
  },
  counterBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontSize: 90,
    color: "#E8E8E8",
    fontWeight: "bold",
    fontVariant: ["tabular-nums"], // Evita que os números pulem de largura
  },
  counterHint: {
    fontSize: 24,
    color: "#555",
    marginTop: -10,
  },
  roundsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#181818",
    borderRadius: 20,
  },
  roundsText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomBar: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  smallButton: {
    padding: 10,
  },
  smallButtonText: {
    color: "#666",
    fontSize: 14,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: "#4da3ff",
    fontSize: 14,
    opacity: 0.7,
  },
});