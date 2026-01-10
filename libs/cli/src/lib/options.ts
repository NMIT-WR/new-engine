import { Options } from "@effect/cli"
import { Effect, Option } from "effect"

const requireValue = (
  value: string | undefined,
  label: string,
  envName: string,
  flagName: string
) =>
  value
    ? Effect.succeed(value)
    : Effect.fail(
        new Error(`Missing ${label}. Provide --${flagName} or set ${envName}.`)
      )

export const resolveOption = (
  optionValue: Option.Option<string>,
  envName: string,
  label: string,
  flagName: string
) =>
  requireValue(
    Option.getOrElse(optionValue, () => process.env[envName]),
    label,
    envName,
    flagName
  )

export const forceRecreateOption = Options.boolean("force-recreate").pipe(
  Options.withDescription(
    "Recreate containers even if configuration is unchanged."
  )
)

export const emailOption = Options.text("email").pipe(
  Options.withAlias("e"),
  Options.optional,
  Options.withDescription("Email for the Medusa admin user.")
)

export const passwordOption = Options.text("password").pipe(
  Options.withAlias("p"),
  Options.optional,
  Options.withDescription("Password for the Medusa admin user.")
)

export const moduleOption = Options.text("module").pipe(
  Options.withAlias("m"),
  Options.optional,
  Options.withDescription("Module name to generate a migration for.")
)
