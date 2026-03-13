import styled from '@emotion/styled';
import { FolderOpen, LayoutGrid, Plus, Search, User } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateEnvironmentDialog from '../components/home/CreateEnvironmentDialog/CreateEnvironmentDialog';
import EnvironmentCard from '../components/home/EnvironmentCard';
import PersonalEnvironmentCard from '../components/home/PersonalEnvironmentCard';
import Button from '../components/shared/Button';
import EmptyState from '../components/shared/EmptyState';
import ErrorState from '../components/shared/ErrorState';
import LoadingState from '../components/shared/LoadingState';
import Tabs from '../components/shared/Tabs/Tabs';
import TabsList from '../components/shared/Tabs/TabsList';
import TabsTrigger from '../components/shared/Tabs/TabsTrigger';
import { useEnvironments } from '../hooks/useEnvironments';

type TabValue = 'mine' | 'all';

export default function HomePage() {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: environments, isLoading, isError, refetch } = useEnvironments();

  const filteredByTab = environments
    ? activeTab === 'mine'
      ? environments.filter((env) => env.currentUserRole === 'manager')
      : environments
    : [];

  const filteredEnvironments = searchQuery.trim()
    ? filteredByTab.filter((env) =>
        env.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : filteredByTab;

  const showEmptyState =
    activeTab === 'mine' &&
    !searchQuery.trim() &&
    filteredByTab.length === 0 &&
    !isLoading &&
    !isError;

  const showNoResults =
    !!searchQuery.trim() && filteredEnvironments.length === 0 && !isLoading && !isError;

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleTabChange(v: string) {
    setActiveTab(v as TabValue);
  }

  function handleOpenCreateDialog() {
    setCreateDialogOpen(true);
  }

  function handleCloseCreateDialog() {
    setCreateDialogOpen(false);
  }

  function handleNavigatePersonal() {
    navigate('/personal');
  }

  return (
    <PageWrapper dir="rtl">
      <NavbarWrapper>
        <Navbar>
          <NavInner>
            <LogoText dir="ltr">
              Comman<LogoAccent>Do</LogoAccent>
            </LogoText>
            <PersonalButton onClick={handleNavigatePersonal} aria-label="אזור אישי">
              <User size={18} />
            </PersonalButton>
          </NavInner>
        </Navbar>
      </NavbarWrapper>

      <PageContent>
        <PageHeader>
          <PageTitle>מערכת לניהול הנחיות</PageTitle>
          <PageSubtitle>בחר סביבת עבודה</PageSubtitle>
        </PageHeader>

        <ActionsRow>
          <Button size="sm" onClick={handleOpenCreateDialog}>
            <Plus size={16} />
            צור סביבה
          </Button>
          <Button size="sm" variant="outline">
            <LayoutGrid size={16} />
            צפייה במארז הדרכה
          </Button>
          <SearchWrapper>
            <SearchIcon size={16} />
            <SearchInput
              placeholder="חפש סביבה"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchWrapper>
        </ActionsRow>

        <TwoColumnGrid>
          <StickyColumn>
            <PersonalEnvironmentCard />
          </StickyColumn>

          <MainColumn>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">כל הסביבות</TabsTrigger>
                <TabsTrigger value="mine">הסביבות שלי</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading && <LoadingState message="טוען סביבות..." />}
            {isError && <ErrorState message="תקלה בטעינת הסביבות" onRetry={() => refetch()} />}

            {showEmptyState && (
              <EmptyState
                icon={<FolderOpen size={64} />}
                title="עדיין אין לך סביבות"
                description="צור סביבה חדשה או בקש הצטרפות לסביבה קיימת כדי להתחיל"
                actionLabel="צור סביבה"
                onAction={handleOpenCreateDialog}
              />
            )}

            {showNoResults && (
              <EmptyState
                icon={<Search size={64} />}
                title="לא נמצאו תוצאות"
                description={`לא נמצאה סביבה בשם "${searchQuery.trim()}"`}
              />
            )}

            {environments && !showEmptyState && !showNoResults && !isLoading && !isError && (
              <CardsGrid>
                {filteredEnvironments.map((env) => (
                  <EnvironmentCard key={env.id} environment={env} />
                ))}
              </CardsGrid>
            )}
          </MainColumn>
        </TwoColumnGrid>
      </PageContent>

      <CreateEnvironmentDialog open={createDialogOpen} onClose={handleCloseCreateDialog} />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
`;

const NavbarWrapper = styled.div`
  padding: 1rem 1.5rem 0;
`;

const Navbar = styled.header`
  background-color: #0b0f2f;
  color: white;
  border-radius: 1rem;
  margin: 0 auto;
  max-width: 1400px;
`;

const NavInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 2rem;
`;

const LogoText = styled.span`
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  user-select: none;
`;

const LogoAccent = styled.span`
  color: var(--color-secondary-light);
`;

const PersonalButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 1px solid rgb(255 255 255 / 0.25);
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgb(255 255 255 / 0.6);
  transition: border-color 150ms;

  &:hover {
    border-color: rgb(255 255 255 / 0.5);
  }
`;

const PageContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  padding-top: 2rem;
  padding-bottom: 0.5rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1.5rem;
  padding-top: 1rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-inline-start: auto;
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

const TwoColumnGrid = styled.div`
  flex: 1;
  padding-bottom: 4rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  align-items: start;
`;

const StickyColumn = styled.div`
  position: sticky;
  top: 1.5rem;
  grid-row: 1 / -1;
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;
