import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { UsersFour } from '@phosphor-icons/react/dist/ssr/UsersFour';
import { Person } from '@phosphor-icons/react/dist/ssr/Person';
import { Toolbox } from '@phosphor-icons/react/dist/ssr/Toolbox';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Shield } from '@phosphor-icons/react/dist/ssr/Shield';

// Get icon code from https://phosphoricons.com/

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'users-four': UsersFour,
  'worker': Person,
  'tool-box': Toolbox,
  'shield': Shield,
  'magnifying-glass': MagnifyingGlass,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
