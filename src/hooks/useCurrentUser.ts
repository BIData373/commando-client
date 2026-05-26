import { currentUser } from "../mocks/data/users";
import { useUser } from "./useUsers";

export function useCurrentUser() {
	return useUser(currentUser.id);
}
