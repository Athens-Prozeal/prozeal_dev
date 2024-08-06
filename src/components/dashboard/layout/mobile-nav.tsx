'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import type { NavItemConfig } from '@/types/nav';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';
import { paths } from '@/paths';
import { navItems } from './config';
import { navIcons } from './nav-icons';

import { WorkSiteRole as workSiteRoleType } from '@/types/worksite';
import { authClient } from '@/lib/auth/client';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const [workSiteRoles, setWorkSiteRoles] = useState<workSiteRoleType[]>();
  const [selectedWorkSite, setSelectedWorkSite] = useState<string>('');

  useEffect(() => {
    authClient.getUser().then(({ data }) => {
      const newWorkSiteRoles = data?.workSiteRoles;
      setWorkSiteRoles(newWorkSiteRoles);

      // Load work site from local storage on first render
      const savedWorkSite = localStorage.getItem('work-site-id');
      console.log('savedWorkSite', savedWorkSite);
      if (savedWorkSite == null) {
        window.location.href = '/auth/select-work-site';
      }
      setSelectedWorkSite(savedWorkSite || '');
    });
  }, [selectedWorkSite]);

  // Handle worksite change and saves work-site-id to local storage
  const handleWorkSiteChange = (event: SelectChangeEvent<string>) => {
    const newWorkSiteId = event.target.value;
    for (const workSite of workSiteRoles || []) {
      if (workSite.id == newWorkSiteId) {
        localStorage.setItem('work-site-id', newWorkSiteId);
        localStorage.setItem('role', workSite.role);
      }
    }

    window.location.reload(); // Refresh the page
  };

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-neutral-950)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--primary-color)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={32} width={122} />
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'var(--mui-palette-neutral-950)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="work-site-label" sx={{ color: 'var(--mui-palette-neutral-400)' }}>
                Work site
              </InputLabel>
              <Select
                labelId="work-site-label"
                value={selectedWorkSite}
                onChange={handleWorkSiteChange}
                sx={{
                  color: 'var(--mui-palette-neutral-400)',
                  '.MuiSelect-icon': { color: 'inherit' },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: 'var(--mui-palette-neutral-950)',
                      color: 'var(--mui-palette-neutral-400)',
                    },
                  },
                }}
              >
                {workSiteRoles &&
                  workSiteRoles.map((workSiteRole:workSiteRoleType) => (
                    <MenuItem key={workSiteRole.id} value={workSiteRole.id}>
                      {workSiteRole.id}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Stack>

      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />

      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
    </Drawer>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends NavItemConfig {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, items }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen((prev: Boolean) => !prev);
  };
  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: items ? '0 16px' : '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
        }}
      >
        {items ? (
          <List sx={{ flex: 1, p: 0 }}>
            <ListItem sx={{ px: 0, flex: 1 }} onClick={handleClick}>
              <Stack direction="row" sx={{ flex: 1, gap: 1 }}>
                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
                  {Icon ? (
                    <Icon
                      fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                      fontSize="var(--icon-fontSize-md)"
                      weight={active ? 'fill' : undefined}
                    />
                  ) : null}
                </Box>
                <Box sx={{ flex: '1 1 auto' }}>
                  <Typography
                    component="span"
                    sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
                  >
                    {title}
                  </Typography>
                </Box>
              </Stack>
              {open ? (
                <CaretUp
                  fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                  fontSize="var(--icon-fontSize-sm)"
                />
              ) : (
                <CaretDown
                  fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                  fontSize="var(--icon-fontSize-sm)"
                />
              )}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {renderNavItems({ pathname, items })}
            </Collapse>
          </List>
        ) : (
          <>
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
              {Icon ? (
                <Icon
                  fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
                  fontSize="var(--icon-fontSize-md)"
                  weight={active ? 'fill' : undefined}
                />
              ) : null}
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography
                component="span"
                sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
              >
                {title}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </li>
  );
}
