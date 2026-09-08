import { createClient } from "npm:@supabase/supabase-js@2";

interface UserData {
    user_id?: string;
    email: string;
    first_name: string;
    last_name: string;
    user_role: "admin" | "supervisor" | "frontline";
    supervisor_id?: string | null;
    start_date?: string | null;
	next_review_date?: string | null;
    is_active?: boolean;
}

interface RequestBody {
    action: "create" | "update" | "delete";
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

		console.log(
			"SUPABASE_URL exists:",
			!!Deno.env.get("SUPABASE_URL")
		);

		console.log(
			"SUPABASE_SECRET_KEYS exists:",
			!!secretKeysRaw
		);

		if (secretKeysRaw) {
			const secretKeys = JSON.parse(secretKeysRaw);

			console.log(
				"Secret key names:",
				Object.keys(secretKeys)
			);
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
                        email_confirm: false,
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
                } = await supabaseAdmin
                    .from("users")
                    .insert({
                        user_id: authData.user.id,
                        email: user.email,
                        phone: user.phone,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        user_role: user.user_role,
                        supervisor_id: user.supervisor_id ?? null,
                        start_date: user.start_date ?? null,
						next_review_date: nextReviewDate ?? null,
                        is_active: user.is_active ?? true,
                    })
                    .select()
                    .single();

                // Roll back Auth account if profile creation fails
                if (profileError) {

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
                console.log(body);
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
                } =
                    await supabaseAdmin
                        .from("users")
                        .update({
                            email: user.email,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            user_role: user.user_role,
                            supervisor_id: user.supervisor_id ?? null,
                            start_date: user.start_date ?? null,
							next_review_date: nextReviewDate ?? null,
                            is_active: user.is_active ?? true,
                        })
                        .eq("user_id", user.user_id)
                        .select()
                        .single();

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
            // // DELETE
            // // ==============================================

            // case "delete": {

            //     if (!body.user_id) {
            //         throw new Error(
            //             "user_id is required."
            //         );
            //     }

            //     const {
            //         error: deleteError,
            //     } =
            //         await supabaseAdmin.auth.admin.deleteUser(
            //             body.user_id
            //         );

            //     if (deleteError) {
            //         throw deleteError;
            //     }

            //     return new Response(
            //         JSON.stringify({
            //             success: true,
            //         }),
            //         {
            //             status: 200,
            //             headers: {
            //                 ...corsHeaders,
            //                 "Content-Type":
            //                     "application/json",
            //             },
            //         }
            //     );
            // }

            default:
                throw new Error(
                    "Invalid action."
                );
        }

    } catch (error) {

        console.error(error);

        return new Response(
            JSON.stringify({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            }),
            {
                status: 400,
                headers: {
                    ...corsHeaders,
                    "Content-Type":
                        "application/json",
                },
            }
        );
    }
});