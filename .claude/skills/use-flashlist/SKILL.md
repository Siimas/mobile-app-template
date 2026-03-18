---
name: use-flashlist
description: Enforces FlashList as the only list component in this React Native/Expo project. Always use this skill before implementing any list, feed, grid, chat message list, search results, or any collection of repeating items. Trigger on any mention of FlatList, ScrollView with map, list of items, feed, infinite scroll, or rendering multiple items from an array. Even if the user just says "show a list of X" or "display my items" — use this skill.
---

# FlashList: The Only List Component

`@shopify/flash-list` is already installed (v2.0.2). Use it for every list in this project — no exceptions for data-driven collections.

## Why FlashList instead of FlatList

FlatList unmounts and remounts cells as they scroll in/out of view. FlashList **recycles** cells — it reuses the same component instances and just updates their props. This means dramatically less work on the JS thread, fewer garbage collection pauses, and smoother scrolling on real devices.

## Minimal usage

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={({ item }) => <MyItem item={item} />}
  estimatedItemSize={80}
  keyExtractor={(item) => item._id}
/>
```

`estimatedItemSize` is required. Set it to the typical rendered height (or width for horizontal lists) of your items in pixels. Measure in the simulator if unsure — an inaccurate value causes layout jank.

## estimatedItemSize reference

| Item type | Typical value |
|---|---|
| Simple text row | 48–56 |
| Row with subtitle | 64–72 |
| Settings row | 52 |
| Chat message | 72–96 |
| Card with image | 140–200 |
| Notification row | 72 |
| Horizontal thumbnail | 120 (width) |

## Common patterns

**Infinite scroll:**
```tsx
<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={80}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
/>
```

**With header and empty state:**
```tsx
<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={80}
  ListHeaderComponent={<Header />}
  ListEmptyComponent={<EmptyState />}
/>
```

**Mixed item types** (headers + rows, ads + content, etc.) — tell FlashList so it can recycle correctly:
```tsx
<FlashList
  data={items}
  renderItem={({ item }) => item.type === "header" ? <SectionHeader item={item} /> : <Row item={item} />}
  estimatedItemSize={56}
  getItemType={(item) => item.type}
/>
```

**Horizontal list:**
```tsx
<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={120}
  horizontal
  showsHorizontalScrollIndicator={false}
/>
```

## Cell recycling gotcha — read this

Because cells are reused rather than remounted, **component state does not reset automatically when a cell moves to a new item**. This is the single most common FlashList bug.

```tsx
// ❌ Bug: `liked` state sticks to the cell, not the item
function PostItem({ item }) {
  const [liked, setLiked] = useState(item.isLiked); // only runs on mount
  useEffect(() => {
    analytics.track("viewed", item.id); // never re-fires for recycled cells
  }, []);
}
```

```tsx
// ✅ Correct: re-sync state when the item changes
function PostItem({ item }) {
  const [liked, setLiked] = useState(item.isLiked);

  useEffect(() => {
    setLiked(item.isLiked);
    analytics.track("viewed", item.id);
  }, [item._id]); // depend on item identity
}

// ✅ Also correct: force remount with key (slight perf cost, simpler code)
renderItem={({ item }) => <PostItem key={item._id} item={item} />}
```

## What NOT to do

```tsx
// ❌ Never use FlatList from react-native
import { FlatList } from "react-native";

// ❌ Never map inside ScrollView for dynamic data
<ScrollView>
  {items.map(item => <MyItem key={item._id} item={item} />)}
</ScrollView>

// ❌ Never use VirtualizedList directly
import { VirtualizedList } from "react-native";
```

`ScrollView` with `.map()` is only acceptable for a small number of **static, non-data-driven** children (e.g., 5 hardcoded settings sections). The moment the children come from an array of data, use FlashList.
