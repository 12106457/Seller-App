import React from "react";
import { View, Text, StyleSheet } from "react-native";

const steps = ["Create Profile", "Register Shop"];

const StepProgress = ({ currentStep = 1 }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        const isCompleted = stepIndex < currentStep; // Green
        const isActive = stepIndex === currentStep; // Red
        const isPending = stepIndex > currentStep; // Gray

        return (
          <View
            key={stepIndex}
            style={[
              styles.step,
              isCompleted
                ? styles.completedStep
                : isActive
                ? styles.activeStep
                : styles.inactiveStep,
            ]}
          >
            <View style={styles.circle}>
              <Text
                style={[
                  styles.stepNumber,
                  isCompleted
                    ? styles.completedTextNumber
                    : isActive
                    ? styles.activeTextNumber
                    : styles.inactiveTextNumber,
                ]}
              >
                {stepIndex}
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                isCompleted
                  ? styles.completedText
                  : isActive
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default StepProgress;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    gap: 10,
  },
  step: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    position: "relative",
    overflow: "hidden",
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  completedStep: {
    backgroundColor: "#4CAF50", // Green for completed steps
  },
  activeStep: {
    backgroundColor: "#FF5733", // Red for the active step
  },
  inactiveStep: {
    backgroundColor: "#ddd", // Gray for not reached steps
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff", // Always white background
    // borderWidth: 2,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  completedTextNumber: {
    color: "#4CAF50", // Green text for completed steps
  },
  activeTextNumber: {
    color: "#FF5733", // Red text for active step
  },
  inactiveTextNumber: {
    color: "#777", // Gray text for not reached steps
  },
  stepText: {
    fontSize: 16,
  },
  completedText: {
    color: "#fff", // White text for completed steps
    fontWeight: "bold",
  },
  activeText: {
    color: "#fff", // White text for active step
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#777", // Gray text for not reached steps
    fontWeight: "bold",
  },
});
