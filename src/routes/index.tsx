import { createFileRoute } from "@tanstack/react-router"
import HomePage from "src/components/HomePage/HomePage"

export const Route = createFileRoute("/")({
	component: HomePage,
})
