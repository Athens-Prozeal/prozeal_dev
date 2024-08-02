'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Collapse,
  Divider,
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

import type { NavItemConfig } from '@/types/nav';
import { WorkSiteRole as workSiteRoleType } from '@/types/worksite';
import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const [workSiteRoles, setWorkSiteRoles] = useState<workSiteRoleType[]>();
  const [selectedWorkSite, setSelectedWorkSite] = useState<string>('');

  useEffect(() => {
    authClient.getUser().then(({ data }) => {
      const allWorkSiteRoles = data?.workSiteRoles;
      setWorkSiteRoles(allWorkSiteRoles);

      // Load work site from local storage on first render
      const savedWorkSite = localStorage.getItem('work-site-id');
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
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--primary-color)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
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
                workSiteRoles.map((workSiteRole) => (
                  <MenuItem key={workSiteRole.id} value={workSiteRole.id}>
                    {workSiteRole.id}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
    </Box>
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
