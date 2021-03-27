package c.team.configuration;

import io.swagger.v3.oas.models.media.UUIDSchema;
import io.swagger.v3.oas.models.parameters.HeaderParameter;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfiguration {
    @Bean
    public OperationCustomizer customize() {
        return (operation, handlerMethod) -> operation.addParametersItem(
                new HeaderParameter()
                        .required(true)
                        .description("Authorization token")
                        .schema(new UUIDSchema())
                        .example("3fa85f64-5717-4562-b3fc-2c963f66afa6")
                        .name("Authorization"));
    }

    @Bean
    public OpenApiCustomiser customerGlobalHeaderOpenApiCustomiser() {
        return openApi -> openApi.getPaths().values().stream().flatMap(pathItem -> pathItem.readOperations().stream())
                .forEach(operation -> {
                            if (List.of("register", "login", "ping").contains(operation.getOperationId())) {
                                operation.getParameters().removeIf(parameter -> "Authorization".equals(parameter.getName()));
                            }
                        }
                );
    }
}
