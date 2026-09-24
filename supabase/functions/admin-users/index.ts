import { createClient } from "npm:@supabase/supabase-js@2";

interface UserData {
    user_id?: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    user_role: "admin" | "supervisor" | "frontline";
    supervisor_id?: string | null;
    start_date?: string | null;
	next_review_date?: string | null;
    is_active?: boolean;
}

interface RequestBody {
    action: "create" | "update" | "disable";
    user?: UserData;
    user_id?: string;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {

    // Handle browser preflight request
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {

        // --------------------------------------------------
        // Create client using the caller's session
        // --------------------------------------------------

		const publishableKeys = JSON.parse(
			Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")!
		);

		const supabase = createClient(
			Deno.env.get("SUPABASE_URL")!,
			publishableKeys["default"],
			{
				global: {
					headers: {
						Authorization:
							req.headers.get("Authorization") ?? "",
					},
				},
			}
		);

        // --------------------------------------------------
        // Get authenticated user
        // --------------------------------------------------

        const {
            data: { user: authUser },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // --------------------------------------------------
        // Create privileged client
        // --------------------------------------------------

		const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");

		// console.log(
		// 	"SUPABASE_URL exists:",
		// 	!!Deno.env.get("SUPABASE_URL")
		// );

		// console.log(
		// 	"SUPABASE_SECRET_KEYS exists:",
		// 	!!secretKeysRaw
		// );

		if (secretKeysRaw) {
			const secretKeys = JSON.parse(secretKeysRaw);

			// console.log(
			// 	"Secret key names:",
			// 	Object.keys(secretKeys)
			// );
		}

		const secretKeys = JSON.parse(
			Deno.env.get("SUPABASE_SECRET_KEYS")!
		);

		const supabaseAdmin = createClient(
			Deno.env.get("SUPABASE_URL")!,
			secretKeys["default"]
		);

        // --------------------------------------------------
        // Verify caller is an admin
        // --------------------------------------------------

        const {
            data: adminUser,
            error: adminError,
        } = await supabaseAdmin
            .from("users")
            .select("user_id, user_role, is_active")
            .eq("user_id", authUser.id)
            .single();

        if (
            adminError ||
            !adminUser ||
            adminUser.user_role !== "admin" ||
            !adminUser.is_active
        ) {
            return new Response(
                JSON.stringify({
                    error: "Forbidden",
                }),
                {
                    status: 403,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // --------------------------------------------------
        // Read request
        // --------------------------------------------------

        const body: RequestBody = await req.json();

        switch (body.action) {

            // ==============================================
            // CREATE
            // ==============================================

            case "create": {

                if (!body.user) {
                    throw new Error(
                        "User data is required."
                    );
                }

                const user = body.user;

				const nextReviewDate = new Date(user.start_date);
				nextReviewDate.setDate(nextReviewDate.getDate() + 15);

                // Create Auth account
                const {
                    data: authData,
                    error: authCreateError,
                } =
                    await supabaseAdmin.auth.admin.createUser({
                        email: user.email,
                        phone: user.phone,
						password: user.password,
                        email_confirm: true,
                        user_metadata: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                        },
                    });

                if (authCreateError) {
                    throw authCreateError;
                }

                if (!authData.user) {
                    throw new Error(
                        "Auth user was not created."
                    );
                }

                // Create application profile
                const {
                    data: profile,
                    error: profileError,
                } = await supabase.rpc("create_employee_profile", {
                    p_user_id: authData.user.id,
                    p_email: user.email,
                    p_phone: user.phone,
                    p_first_name: user.first_name,
                    p_last_name: user.last_name,
                    p_user_role: user.user_role,
                    p_supervisor_id: user.supervisor_id ?? null,
                    p_start_date: user.start_date ?? null,
                    p_next_review_date: nextReviewDate.toISOString(),
                    p_is_active: user.is_active ?? true,
                });

                if (profileError) {
                    // Roll back Auth account
                    await supabaseAdmin.auth.admin.deleteUser(
                        authData.user.id
                    );

                    throw profileError;
                }

                return new Response(
                    JSON.stringify({
                        success: true,
                        user: profile,
                    }),
                    {
                        status: 201,
                        headers: {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );
            }

            // ==============================================
            // UPDATE
            // ==============================================

            case "update": {
                if (!body.user?.user_id) {
                    throw new Error(
                        "user_id is required."
                    );
                }

                const user = body.user;

				const nextReviewDate = new Date(user.start_date);
				nextReviewDate.setDate(nextReviewDate.getDate() + 15);

                // Update Auth record
                const {
                    error: authUpdateError,
                } =
                    await supabaseAdmin.auth.admin.updateUserById(
                        user.user_id,
                        {
                            email: user.email,
                            user_metadata: {
                                first_name: user.first_name,
                                last_name: user.last_name,
                            },
                        }
                    );

                if (authUpdateError) {
                    throw authUpdateError;
                }

                // Update application profile
                const {
                    data: profile,
                    error: profileError,
                } = await supabase.rpc("update_employee_profile", {
                    p_user_id: user.user_id,
                    p_email: user.email,
                    p_phone: user.phone,
                    p_first_name: user.first_name,
                    p_last_name: user.last_name,
                    p_user_role: user.user_role,
                    p_supervisor_id: user.supervisor_id ?? null,
                    p_start_date: user.start_date ?? null,
                    p_next_review_date: nextReviewDate.toISOString(),
                    p_is_active: user.is_active ?? true,
                });

                if (profileError) {
                    throw profileError;
                }

                return new Response(
                    JSON.stringify({
                        success: true,
                        user: profile,
                    }),
                    {
                        status: 200,
                        headers: {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );
            }

            // // ==============================================
            // // DISABLE / ENABLE
            // // ==============================================

            case "disable": {
                if (!body.user?.user_id) {
                    throw new Error(
                        "user_id is required."
                    );
                }

                const user = body.user;

                // Update Auth record
                const {
                    error: authUpdateError,
                } =
                    await supabaseAdmin.auth.admin.updateUserById(
                        user.user_id,
                        {
                            ban_duration: user.is_active ? 'none' : '876000h'
                        }
                    );

                if (authUpdateError) {
                    throw authUpdateError;
                }

                // Update application profile
                const {
                    data: profile,
                    error: profileError,
                } = await supabase.rpc("disable_employee", {
                    p_user_id: user.user_id,
                    p_is_active: user.is_active ?? true,
                });

                if (profileError) {
                    throw profileError;
                }

                return new Response(
                    JSON.stringify({
                        success: true,
                        user: profile,
                    }),
                    {
                        status: 200,
                        headers: {
                            ...corsHeaders,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );
            }

            default:
                throw new Error(
                    "Invalid action."
                );
        }

    } catch (error) {
        console.error("admin-users error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : typeof error === "object"
                            ? error
                            : String(error),
            }),
            {
                status: 400,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});