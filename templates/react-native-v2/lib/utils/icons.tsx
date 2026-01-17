import { FontAwesome } from "@expo/vector-icons";

type IconProps = {
    size?: number;
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color?: string;
}

export function Icon({ size = 32, name, color = "black" }: IconProps) {
    const iconMargin = { marginBottom: -3 }

    return <FontAwesome size={size} name={name} color={color} style={iconMargin} />;
}