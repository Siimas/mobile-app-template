---
name: use-reanimated
description: >
  For this React Native/Expo project: ALWAYS use this skill when adding any motion, animation, or
  transition to a component — including button press feedback, banners sliding in/out, onboarding
  step transitions, skeleton loaders, list item entrances, or any element that should appear or
  disappear smoothly instead of instantly. Also trigger when converting `import { Animated } from
  'react-native'` or `LayoutAnimation` to something better. Trigger on phrases like "animate",
  "transition", "slide", "fade", "bounce", "pulse", "spring", "press effect", "loading shimmer",
  "smooth", "motion". Do NOT use for screen-level navigation transitions (expo-router handles those),
  web/CSS animations, or scroll performance issues unrelated to animation.
---

# React Native Reanimated v4 — the only animation system

This project uses **react-native-reanimated v4** exclusively. All animations must use Reanimated.

> **Why not RN's built-in Animated?** Reanimated runs on the UI thread via worklets — no JS bridge, no dropped frames. The built-in `Animated` API requires `useNativeDriver: true` workarounds and has real limitations. Reanimated's hooks and layout animations are also far more ergonomic.

## NativeWind + Reanimated

This project styles with NativeWind (`className`). Use `className` for static styles and `style` for animated values — both props coexist on `Animated.*` components:

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// className handles layout/colors, style carries the motion
<Animated.View className="bg-white rounded-2xl px-4 py-3" style={animatedStyle} />
```

## The four building blocks

### 1. Shared values + animated style

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring, ReduceMotion } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PressableCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      className="bg-white rounded-2xl p-4"
      style={animatedStyle}
      onPressIn={() => { scale.value = withSpring(0.96, { reduceMotion: ReduceMotion.System }); }}
      onPressOut={() => { scale.value = withSpring(1, { reduceMotion: ReduceMotion.System }); }}
    />
  );
}
```

### 2. Layout animations (entering/exiting)

```tsx
import Animated, { FadeInDown, FadeOut, LinearTransition, ReduceMotion } from 'react-native-reanimated';

// Animates in on mount, out on unmount — no hooks needed
<Animated.View
  className="bg-red-700 px-4 py-2.5"
  entering={FadeInDown.duration(300).reduceMotion(ReduceMotion.System)}
  exiting={FadeOut.duration(200).reduceMotion(ReduceMotion.System)}
  layout={LinearTransition}
>
  <Text className="text-sm font-semibold text-white">Message</Text>
</Animated.View>
```

### 3. Always-mounted show/hide (when component must stay in tree)

Use this when the parent passes a `visible` prop and can't conditionally render:

```tsx
function Banner({ message, visible }: { message: string; visible: boolean }) {
  const translateY = useSharedValue(-60);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const config = { duration: visible ? 300 : 200, reduceMotion: ReduceMotion.System };
    translateY.value = withTiming(visible ? 0 : -60, config);
    opacity.value = withTiming(visible ? 1 : 0, config);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View className="bg-red-700 px-4 py-2.5" style={animatedStyle}>
      <Text className="text-sm font-semibold text-white">{message}</Text>
    </Animated.View>
  );
}
```

**Prefer conditional rendering + `entering`/`exiting`** when possible — it's simpler and needs no hooks.

### 4. Gesture-driven animation (with react-native-gesture-handler)

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withDecay } from 'react-native-reanimated';

function DraggableItem() {
  const offsetX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => { offsetX.value = e.translationX; })
    .onEnd((e) => { offsetX.value = withDecay({ velocity: e.velocityX, clamp: [-200, 200] }); });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View className="w-20 h-20 bg-blue-500 rounded-xl" style={style} />
    </GestureDetector>
  );
}
```

## Animation functions

| Function | When to use |
|---|---|
| `withTiming(value, { duration, easing })` | Precise duration-based transitions |
| `withSpring(value, config)` | Natural physics-based motion (default for press feedback) |
| `withSequence(...animations)` | Chain animations one after another |
| `withRepeat(animation, -1, true)` | Looping (pulse, shimmer) |
| `withDelay(ms, animation)` | Stagger effects |
| `withDecay({ velocity, clamp })` | Momentum/fling after gesture ends |

**Common spring configs:**

```tsx
import { withSpring, GentleSpringConfig, SnappySpringConfig } from 'react-native-reanimated';

scale.value = withSpring(1, GentleSpringConfig);   // soft, smooth
scale.value = withSpring(1, SnappySpringConfig);   // tight, responsive
```

## Interpolation

```tsx
import { interpolate, Extrapolation, interpolateColor } from 'react-native-reanimated';

const style = useAnimatedStyle(() => {
  const opacity = interpolate(progress.value, [0, 100], [0, 1], Extrapolation.CLAMP);
  const bg = interpolateColor(progress.value, [0, 1], ['#ffffff', '#000000']);
  return { opacity, backgroundColor: bg };
});
```

## Layout animation presets

**Entry:** `FadeIn`, `FadeInDown`, `FadeInUp`, `SlideInDown`, `SlideInRight`, `ZoomIn`, `BounceIn`

**Exit:** Mirror with `Out` suffix — `FadeOut`, `FadeOutDown`, `SlideOutUp`, `ZoomOut`, etc.

**Layout transitions:** `LinearTransition`, `FadingTransition`, `SequencedTransition`, `CurvedTransition`

Builder modifiers: `.duration(ms)`, `.delay(ms)`, `.withCallback(fn)`, `.reduceMotion(ReduceMotion.System)`

## Staggered list entrances

```tsx
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    className="bg-white rounded-xl p-4 mb-3"
    entering={FadeInDown.delay(index * 60).duration(300).reduceMotion(ReduceMotion.System)}
  >
    <Text className="text-base">{item.label}</Text>
  </Animated.View>
))}
```

## Animated components

Use `Animated.*` wrappers when applying `animatedStyle`:

```tsx
import Animated from 'react-native-reanimated';

// ✅ Correct
<Animated.View style={animatedStyle} />
<Animated.Text style={animatedStyle} />
<Animated.Image style={animatedStyle} />
<Animated.ScrollView onScroll={scrollHandler} />

// For custom components:
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
```

## Scroll-linked animations

```tsx
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate, Extrapolation
} from 'react-native-reanimated';

function ParallaxHeader() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(scrollY.value, [0, 100], [0, -50], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
      <Animated.View className="h-48" style={headerStyle} />
    </Animated.ScrollView>
  );
}
```

## Accessibility

Always respect reduced motion:

```tsx
withTiming(value, { duration: 300, reduceMotion: ReduceMotion.System })
withSpring(value, { ...config, reduceMotion: ReduceMotion.System })

// Or check imperatively:
const prefersReducedMotion = useReducedMotion();
```

## Banned patterns

```tsx
// ❌ React Native's built-in Animated API
import { Animated } from 'react-native';
const value = new Animated.Value(0);
Animated.timing(value, { toValue: 1, useNativeDriver: true }).start();

// ❌ LayoutAnimation from react-native
import { LayoutAnimation } from 'react-native';

// ❌ Applying animatedStyle to a plain RN component (won't animate)
<View style={animatedStyle} />   // Must be <Animated.View>

// ❌ Reading shared value without .value in worklet
transform: [{ translateX: offset }]   // Missing .value — will crash or be wrong

// ❌ v3 worklet imports (deprecated in v4)
import { runOnUI, runOnJS } from 'react-native-reanimated';
// Use: import { scheduleOnUI, scheduleOnRN } from 'react-native-worklets';
```
