import styled from "@emotion/styled";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "src/components/ui/card";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	staticData: {
		header: {
			title: "סביבות",
			navigation: false,
			user: false,
		},
	},
});

interface Workspace {
	urlName: string;
	displayName: string;
	description: string;
	memberCount: number;
}

const PLACEHOLDER_WORKSPACES: Workspace[] = [
	{
		urlName: "alpha-unit",
		displayName: "יחידה אלפא",
		description: "ניהול משימות יחידת אלפא",
		memberCount: 12,
	},
	{
		urlName: "bravo-unit",
		displayName: "יחידה ברבו",
		description: "מטה ותיאום מבצעי",
		memberCount: 8,
	},
	{
		urlName: "charlie-unit",
		displayName: "יחידה צ'רלי",
		description: "לוגיסטיקה ותמיכה",
		memberCount: 15,
	},
	{
		urlName: "command-hq",
		displayName: "מפקדה",
		description: "מטה פיקוד עליון",
		memberCount: 5,
	},
];

interface WorkspaceCardProps {
	workspace: Workspace;
}

function WorkspaceCard({ workspace }: WorkspaceCardProps) {
	const navigate = useNavigate();

	function handleWorkspaceClick() {
		navigate({
			to: "/workspace/$urlName",
			params: { urlName: workspace.urlName },
		});
	}

	return (
		<Card onClick={handleWorkspaceClick}>
			<CardHeader>
				<CardTitle>{workspace.displayName}</CardTitle>
				<CardDescription>{workspace.description}</CardDescription>

				<CardAction>
					<Avatar>
						<AvatarImage
							src="/workspace-icon.png"
							alt="@shadcn"
							className="grayscale"
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</CardAction>
			</CardHeader>
			<CardFooter>{workspace.memberCount} משתמשים</CardFooter>
		</Card>
	);
}

function RouteComponent() {
	const navigate = useNavigate();

	function handlePersonalClick() {
		navigate({ to: "/personal", search: { view: "TABLE" } });
	}

	function handleWorkspaceClick(urlName: string) {
		navigate({ to: "/workspace/$urlName", params: { urlName } });
	}

	return (
		<PageRoot>
			<PersonalBanner onClick={handlePersonalClick}>
				<PersonalLabel>אזור אישי</PersonalLabel>
				<PersonalSub>משימות ופעולות אישיות</PersonalSub>
			</PersonalBanner>

			<SectionTitle>סביבות עבודה</SectionTitle>

			<WorkspaceGrid>
				{PLACEHOLDER_WORKSPACES.map((ws) => (
					<WorkspaceCard key={ws.urlName} workspace={ws} />
				))}
			</WorkspaceGrid>
		</PageRoot>
	);
}

const PageRoot = styled.div`
  padding-block: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PersonalBanner = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 20px 24px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 12px;
  cursor: pointer;
  text-align: start;
  transition: background 0.15s;

  &:hover {
    background: var(--link-bg-hover);
  }
`;

const PersonalLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--sea-ink);
`;

const PersonalSub = styled.span`
  font-size: 14px;
  color: var(--sea-ink-soft);
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--sea-ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`;

const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

const WorkspaceIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const WorkspaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const WorkspaceName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--sea-ink);
`;

const WorkspaceDesc = styled.span`
  font-size: 13px;
  color: var(--sea-ink-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WorkspaceMeta = styled.span`
  font-size: 12px;
  color: var(--sea-ink-soft);
`;
