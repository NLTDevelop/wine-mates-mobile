# AGENTS.md

## Project Architecture Rules

These rules are mandatory for all new code and when refactoring existing code.

---

## 1. Types in presenters

**Required:**
- types, interfaces, and enums that are reused outside a specific presenter must be moved to a separate `types` or `enums` folder
- local types, interfaces, and enums may be declared inside a presenter only if they are used exclusively in that presenter

**Forbidden:**
- declaring `interface`, `type`, or `enum` inside a presenter if they are intended to be reused outside that presenter
- mixing business logic with shared type declarations in the same file

**Allowed:**
- local presenter-only types
- local presenter-only interfaces
- local presenter-only enums

**Naming rule for props:**
- if an interface describes component props, it must always be named `IProps`

**Correct folder examples:**
- `types/`
- `presenters/`
- `UI/`
- `enums/`

---

## 2. All logic must live in presenters

**Required:**
- all logic must be moved to presenters
- components must stay as clean as possible and be responsible only for UI

**Forbidden:**
- business logic inside components
- temporary or test logic inside components
- handlers, calculations, data transformations, and display conditions inside UI components, unless this is part of pure rendering

**A component must:**
- receive prepared data
- receive prepared handlers
- render UI

**A presenter must:**
- prepare data for UI
- contain handlers
- contain calculations and derived logic
- encapsulate screen or component behavior

---

## 3. Folder structure must be unified

### General structure

The `modules` folder contains modules:
- `home`
- `profile`
- and others

Each module should follow this structure:

```text
modules/
  home/
    presenters/
    UI/
      components/
      HomeScreen/
```

### Module structure rules

**Required:**
- each module must have a `presenters` folder if the module has shared logic
- each module must have a `UI` folder
- `UI` must contain a `components` folder for reusable components inside the module
- `UI` must contain screen folders

### Screen or component structure

If a screen or component has its own logic, it must contain:

```text
ComponentName/
  presenters/
  index.tsx
  styles.ts
```

or

```text
ScreenName/
  presenters/
  index.tsx
  styles.ts
```

### Local screen components

If a screen needs internal components that are used only on that screen, they must be placed in that screen's `components` folder.

Example:

```text
SomeScreen/
  components/
  presenters/
  index.tsx
  styles.ts
```

**Required:**
- all components used only by a specific screen must be stored in that screen's `components` folder
- do not move such components to shared `UI/components` unless they are reused across the module

**Forbidden:**
- unnecessary nesting
- creating `components` inside every local component
- chains like `components/.../components/...`

### Exception

A `components` folder inside a component is allowed **only in UIKit**.

---

## 4. Render functions must stay inside the component

**Required:**
- render functions must be declared inside the component
- render functions should be used only when really necessary

**Allowed:**
- `renderItem`
- `renderLeftActions`
- `renderRightActions`
- other render callbacks only when required by a library API or list structure

**Forbidden:**
- moving render functions to a presenter
- creating a separate hook only for a render function
- using render functions as a regular UI decomposition pattern

**Principle:**
- if regular JSX can be used, regular JSX must be used
- a render function is an exception, not the standard

---

## 5. UI calculated values must be moved to a separate hook

**Required:**
- all calculated values for UI must be moved to a separate hook
- the component must receive already prepared values

**Examples:**
- derived values
- formatted data
- display flags
- prepared arrays
- calculated sizes, labels, UI states

**Forbidden:**
- doing a large amount of calculations directly inside the component
- cluttering a component with `useMemo`, `map`, `filter`, `reduce`, conditions, and data preparation when that can be moved out

**Goal:**
- keep the component as clean as possible
- separate UI data preparation from JSX
- improve readability and maintainability

---

## 6. Arrow functions in components are forbidden

**Required:**
- do not use arrow functions inside JSX
- do not create inline handlers in props
- move all handlers to presenters
- pass ready-to-use function references into the component, for example:
  - `onPress`
  - `onChangeText`
  - `onClose`
  - `onSelect`
  - `onSubmit`

**Forbidden:**
- `onPress={() => ...}`
- `onChangeText={(value) => ...}`
- `renderItem={({ item }) => ...}` if it can be avoided
- declaring arrow functions inside the component body for UI events
- wrapping existing handlers in additional anonymous functions without a real need

**Correct:**
```tsx
<Button onPress={onPress} />
<Input onChangeText={onChangeText} />
```

**Incorrect:**
```tsx
<Button onPress={() => onPressSave()} />
<Input onChangeText={(value) => onChangeValue(value)} />
```

**Requirement:**
- if a handler needs parameters, the wrapper must be created in the presenter, not in the component

Example:

```ts
// presenter
const onPressSave = () => {
  save(itemId);
};

return {
  onPressSave,
};
```

```tsx
// component
<Button onPress={onPressSave} />
```

---

## 7. Avoid render functions whenever possible

**Required:**
- avoid render functions whenever possible
- prefer regular components and explicit JSX first
- use render functions only where the library API makes them necessary

**Forbidden:**
- using render functions as a default coding style
- splitting UI into `renderHeader`, `renderFooter`, `renderContent`, and similar functions without a real need

**Principle:**
- fewer render functions
- fewer anonymous functions
- less noise in the component
- more explicit structure through JSX and separate components

---

## 8. A component must stay as dumb as possible

This is a key rule.

---

## 9. Scale rules for self-scaling components

**Required:**
- do not apply additional `scaleVertical`, `scaleHorizontal`, or other manual scaling to props like `width`, `height`, `size`, `radius`, etc. when the target component already scales these values internally
- this rule applies not only to icons, but to any component with built-in scaling behavior
- before adding scaling to component props, verify whether scaling is already handled inside that component

**Forbidden:**
- double scaling (external `scale*` + internal scaling in the same component)
- assuming props must always be scaled without checking component internals

**Allowed:**
- use `scale*` for plain style values in containers/layout where no internal scaling exists
- pass raw design values to components that self-scale

**A component must not:**
- know business logic
- contain calculations
- contain arrow handlers
- contain temporary data transformations
- contain extra conditions that can be moved out

**A component must:**
- render UI
- use `styles`
- receive prepared data and handlers
- stay simple and easy to read

---

## 9. Priority when writing code

When implementing new functionality, the order of thinking must be:

1. Define the folder structure
2. Move shared types to `types`
3. Implement logic in `presenters`
4. Move calculated UI values to separate hooks
5. Only after that build the clean UI component
6. Check that the component has no arrow functions and no extra logic
7. Check that render functions are used only where they are truly required

---

## 10. What is considered a violation

A violation includes:

- logic inside a component
- shared types inside a presenter
- inline arrow functions in JSX
- handlers created inside a component
- unnecessary render functions
- UI calculations directly inside a component
- incorrect or excessive folder nesting
- local components placed outside the screen folder
- leaving logic in UI “temporarily for testing”

---

## 11. Main principle

**UI must stay clean.**  
**Logic must live in presenters.**  
**Shared types must live in `types`.**  
**Arrow functions in components are forbidden.**  
**Render functions are exceptions only.**

---

## 12. Handler naming

**Required:**
- use naming with `on`, not `handle`

**Correct:**
- `onPress`
- `onChangeText`
- `onSubmit`
- `onClose`

**Forbidden:**
- `handlePress`
- `handleChange`
- `handleSubmit`

**Principle:**
- the component receives an event-like prop (`onPress`)
- the presenter describes the reaction to that event

---

## 13. All logic, calculations, and animations must be moved out of the component

**Required:**
- all calculations must be moved to a presenter or separate hooks
- all business logic must be in a presenter
- all animations must be moved out of the component

**Forbidden:**
- calculations inside a component
- using `useMemo`, `useCallback`, `map`, `filter`, and similar logic inside a component for data preparation
- writing animation logic (`Reanimated`, `Animated`, and similar) directly in a component

**Animations:**
- must be encapsulated in a presenter or a separate hook
- the component must receive ready-to-use values, styles, and handlers

**Example:**
```ts
// presenter / hook
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateY: value.value }],
  };
});

return {
  animatedStyle,
};
```

```tsx
// component
<Animated.View style={animatedStyle} />
```

**Exception:**
- minimal animation integration inside a component is allowed if required by a library API
- but all logic and calculations must still stay outside the component

---

## 14. Extended main principle

- UI = rendering only
- Presenter = all logic + handlers + animations
- Hooks = calculations and derived UI state
- Types = types only

**Any deviation from this is an architecture violation.**

---

## 15. `useUiContext` and `styles` must stay inside the component

**Required:**
- call `useUiContext()` only inside the component
- create `styles` with `useMemo` only inside the component

**Correct:**
```tsx
const { colors } = useUiContext();
const styles = useMemo(() => getStyles(colors), [colors]);
```

**Forbidden:**
- moving `useUiContext` to a presenter
- returning `colors` from a presenter
- returning `styles` from a presenter
- creating `styles` outside the component if they depend on theme

**Principle:**
- theme and styles are part of the UI layer
- a presenter must not know anything about UI concerns such as colors or styles

**Exception:**
- static styles may exist outside the component if they do not depend on theme

---

## 16. `keyExtractor` must stay inside the component

**Required:**
- `keyExtractor` must be declared inside the component

**Correct:**
```tsx
const keyExtractor = (item: ItemType) => item.id;

<FlatList
  data={data}
  keyExtractor={keyExtractor}
/>
```

**Forbidden:**
- moving `keyExtractor` to a presenter
- returning `keyExtractor` from a presenter

**Principle:**
- `keyExtractor` is part of list rendering (UI)
- a presenter must not know about list rendering

---

## 17. `getStyles` creation standard

**Required:**
- `getStyles` must always be created as a function
- inside the function, always create `const styles = StyleSheet.create(...)`
- after that, always `return styles`

**Required template:**
```ts
export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
    });

    return styles;
};
```

**Forbidden:**
- returning `StyleSheet.create(...)` directly without an intermediate variable
- creating styles outside the function when they depend on theme
- changing the structure: it must always be `const styles`, then `return styles`

**Principle:**
- keep one consistent code style across the project
- improve readability and predictability

---

## 18. `switch/case` usage is forbidden

**Required:**
- do not use `switch/case` in new code
- for 1-2 branches, use `if` / `if else`
- for many branches, use object mapping (`Record`, plain object lookup, or function map)

**Forbidden:**
- introducing new `switch/case` blocks in presenters, hooks, components, and utils
- replacing simple `if` chains with `switch/case`

**Principle:**
- keep control flow explicit and predictable
- reduce bulky branching blocks and prevent accidental fallthrough
