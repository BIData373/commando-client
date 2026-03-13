import styled from '@emotion/styled';
import { Search, Settings, Shield, Users } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssigneesTab from '../components/environment-settings/AssigneesTab/AssigneesTab';
import GeneralTab from '../components/environment-settings/GeneralTab';
import PermissionsTab from '../components/environment-settings/PermissionsTab';
import type { SidebarItem } from '../components/shared/EnvironmentHeader/EnvironmentHeader';
import EnvironmentHeader from '../components/shared/EnvironmentHeader/EnvironmentHeader';
import ErrorState from '../components/shared/ErrorState';
import LoadingState from '../components/shared/LoadingState';
import { useEnvironment } from '../hooks/useEnvironments';
import type { PageParams } from '../utils/paramUtils';

type SettingsTab = 'general' | 'assignees' | 'permissions';

interface SettingsTabItem {
  key: SettingsTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: SettingsTabItem[] = [
  { key: 'general', label: 'הגדרות כלליות', icon: <Settings size={16} /> },
  { key: 'assignees', label: 'מקבלי הנחיות', icon: <Users size={16} /> },
  { key: 'permissions', label: 'הרשאות סגל', icon: <Shield size={16} /> },
];

export default function EnvironmentSettingsPage() {
  const { envId } = useParams<PageParams>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: environment, isLoading, isError, refetch } = useEnvironment(envId ?? '');

  function handleItemChange(item: SidebarItem) {
    if (item === 'instructions' || item === 'home') {
      navigate(`/env/${envId}`);
    }
  }

  function handleRetry() {
    refetch();
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  return (
    <PageWrapper>
      {isLoading && <LoadingState message="טוען פרמטרים..." />}

      {(isError || (!isLoading && !environment)) && (
        <ErrorState message="תקלה בטעינת הפרמטרים" onRetry={handleRetry} />
      )}

      {environment && (
        <>
          <EnvironmentHeader
            environmentName={environment.name}
            activeItem="settings"
            onItemChange={handleItemChange}
          />

          <SecondaryBar>
            <SecondaryBarInner>
              <PageTitle>הגדרות הסביבה</PageTitle>
              <SearchWrapper>
                <SearchIcon size={16} />
                <SearchInput
                  type="text"
                  placeholder="חיפוש..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="חיפוש בפרמטרים"
                />
              </SearchWrapper>
            </SecondaryBarInner>
          </SecondaryBar>

          <PageContent>
            <TabBar>
              {TABS.map((tab) => (
                <TabButton
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  $active={activeTab === tab.key}
                >
                  {tab.icon}
                  {tab.label}
                </TabButton>
              ))}
            </TabBar>

            {activeTab === 'general' && (
              <GeneralTab envName={environment.name} envDescription={environment.description} />
            )}
            {activeTab === 'assignees' && <AssigneesTab envId={envId ?? ''} />}
            {activeTab === 'permissions' && <PermissionsTab envId={envId ?? ''} />}
          </PageContent>
        </>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
`;

const SecondaryBar = styled.div`
  background-color: var(--color-paper);
  border-bottom: 1px solid var(--color-gray-200);
`;

const SecondaryBarInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.5rem;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  inset-inline-start: 0.75rem;
  color: var(--color-text-disabled);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 0.375rem 0.75rem 0.375rem 2.25rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background-color: var(--color-gray-50);
  color: var(--color-text-primary);
  outline: none;
  transition: background-color 150ms, border-color 150ms, box-shadow 150ms;

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:hover {
    background-color: var(--color-gray-100);
  }

  &:focus {
    background-color: var(--color-paper);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
  }
`;

const PageContent = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--color-gray-100);
  margin-bottom: 2.5rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'transparent')};
  background: none;
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-disabled)')};
  cursor: pointer;
  transition: color 150ms, border-color 150ms;

  &:hover {
    color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--color-text-secondary)')};
  }
`;
