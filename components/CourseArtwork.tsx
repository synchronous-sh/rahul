import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";
import { PathId } from "@/data/courses";

type Props = {
  path: PathId;
  title: string;
  style?: ViewStyle;
};

// Every visible course title has its own local cover. Keeping this mapping
// explicit prevents network failures and accidental duplicate artwork.
const covers: Record<string, number> = {
  "Finance": require("../assets/course-covers/finance.jpg"),
  "World History": require("../assets/course-covers/world-history.jpg"),
  "Technology": require("../assets/course-covers/technology.jpg"),
  "Artificial Intelligence": require("../assets/course-covers/artificial-intelligence.jpg"),
  "Psychology": require("../assets/course-covers/psychology.jpg"),
  "Economics": require("../assets/course-covers/economics.jpg"),
  "Science": require("../assets/course-covers/science.jpg"),
  "Space": require("../assets/course-covers/space.jpg"),
  "Design": require("../assets/course-covers/design.jpg"),
  "Business Strategy": require("../assets/course-covers/business-strategy.jpg"),
  "Finance Essentials": require("../assets/course-covers/finance-essentials.jpg"),
  "Market Economics": require("../assets/course-covers/market-economics.jpg"),
  "Computing & Software": require("../assets/course-covers/computing-software.jpg"),
  "Applied AI": require("../assets/course-covers/applied-ai.jpg"),
  "Digital Product Design": require("../assets/course-covers/digital-product-design.jpg"),
  "AI Foundations": require("../assets/course-covers/ai-foundations.jpg"),
  "Technology for AI": require("../assets/course-covers/technology-for-ai.jpg"),
  "Human Intelligence": require("../assets/course-covers/human-intelligence.jpg"),
  "Core Science": require("../assets/course-covers/core-science.jpg"),
  "Astronomy": require("../assets/course-covers/astronomy.jpg"),
  "Behavioral Science": require("../assets/course-covers/behavioral-science.jpg"),
  "Economic History": require("../assets/course-covers/economic-history.jpg"),
  "History of Design": require("../assets/course-covers/history-of-design.jpg"),
  "Mental Health Foundations": require("../assets/course-covers/mental-health-foundations.jpg"),
  "Movement & Recovery": require("../assets/course-covers/movement-recovery.jpg"),
  "Human Biology": require("../assets/course-covers/human-biology.jpg"),
  "Political History": require("../assets/course-covers/political-history.jpg"),
  "Political Economy": require("../assets/course-covers/political-economy.jpg"),
  "Public Opinion": require("../assets/course-covers/public-opinion.jpg"),
  "Cooking Science": require("../assets/course-covers/cooking-science.jpg"),
  "Food Chemistry": require("../assets/course-covers/food-chemistry.jpg"),
  "Food Business": require("../assets/course-covers/food-business.jpg"),
  "Sports Science": require("../assets/course-covers/sports-science.jpg"),
  "Performance Psychology": require("../assets/course-covers/performance-psychology.jpg"),
  "Physics of Sport": require("../assets/course-covers/physics-of-sport.jpg"),
  "Markets & Investing": require("../assets/course-covers/markets-investing.jpg"),
  "Business Economics": require("../assets/course-covers/business-economics.jpg"),
  "Management": require("../assets/course-covers/management.jpg"),
};

const pathFallbacks: Record<PathId, number> = {
  ai: covers["Artificial Intelligence"],
  finance: covers["Finance"],
  history: covers["World History"],
  science: covers["Science"],
  business: covers["Business Strategy"],
  technology: covers["Technology"],
  psychology: covers["Psychology"],
  space: covers["Space"],
  cooking: covers["Cooking Science"],
  sports: covers["Sports Science"],
  economics: covers["Economics"],
  design: covers["Design"],
};

export function CourseArtwork({ path, title, style }: Props) {
  const source = covers[title] ?? pathFallbacks[path];
  return (
    <View style={[styles.frame, style]}>
      <Image
        source={source}
        style={styles.photo}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: "#0a0a0a", overflow: "hidden" },
  photo: { ...StyleSheet.absoluteFillObject },
});
